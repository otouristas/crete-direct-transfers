#!/usr/bin/env node
/**
 * Resolves a Pexels photo for every place we publish a page for and writes the
 * result to src/data/place-images.json.
 *
 * Runs at build time only — production never calls the Pexels API, so the key
 * stays server-side and pages carry no third-party image latency or rate limit.
 *
 * Usage:
 *   npm run images:pexels              # fill in missing slots only (incremental)
 *   npm run images:pexels -- --force   # re-resolve everything
 *   npm run images:pexels -- --only=country:greece,city:madrid
 *   npm run images:pexels -- --dry-run # show the plan, call nothing
 *
 * Requires PEXELS_API_KEY (see .env.example). The free tier allows 200
 * requests/hour, so the script throttles and resumes: interrupt it and re-run,
 * and it picks up only the slots still missing.
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

import { MARKETS } from "../src/data/markets.ts";
import { DESTINATIONS } from "../src/data/destinations.ts";
import { MARKET_HUB_AIRPORTS, MARKET_HUB_CITIES } from "../src/data/market-hubs.ts";
// The IATA catalog is read as raw JSON — importing iata-airports.ts would need
// a JSON import attribute that only the Vite side of the build supplies.
const IATA = JSON.parse(
  await readFile(new URL("../src/data/iata-airports.json", import.meta.url), "utf8"),
);
const IATA_COUNTRY_NAMES = IATA.countries;
const IATA_AIRPORTS = IATA.airports;
/** Row: [iata, name, city, countryCode, lat, lng] — mirrors src/data/iata-airports.ts. */
const iataByCode = new Map(IATA_AIRPORTS.map((row) => [row[0], row]));

/** Kept in sync with FEATURED_IATA in src/data/iata-airports.ts. */
const FEATURED_IATA = [
  "LHR",
  "CDG",
  "AMS",
  "FRA",
  "FCO",
  "MXP",
  "BCN",
  "MAD",
  "LIS",
  "DUB",
  "ATH",
  "IST",
  "DXB",
  "DOH",
  "AUH",
  "JFK",
  "EWR",
  "LAX",
  "ORD",
  "MIA",
  "SFO",
  "YYZ",
  "SIN",
  "HKG",
  "NRT",
  "ICN",
  "BKK",
  "SYD",
  "MEL",
  "HER",
  "CHQ",
  "SKG",
  "JTR",
  "JMK",
  "RHO",
  "CFU",
  "ZTH",
  "BER",
  "MUC",
  "VIE",
  "ZRH",
  "CPH",
  "ARN",
  "OSL",
  "HEL",
  "GRU",
  "EZE",
  "JNB",
  "CAI",
  "TLV",
  "BOM",
  "DEL",
];

/**
 * airports.ts, regions.ts and services.ts now resolve their own imagery *from*
 * the manifest this script writes, so importing them here would be a cycle (and
 * their `@/` aliases don't resolve under plain Node). Their record literals are
 * stable, so we read the few fields we need straight out of the source text.
 * `extract` asserts a non-empty result, so a shape change fails loudly instead
 * of silently dropping slots.
 */
async function extract(file, pattern, fields) {
  const text = await readFile(new URL(`../src/data/${file}`, import.meta.url), "utf8");
  const rows = [...text.matchAll(pattern)].map((m) =>
    Object.fromEntries(fields.map((f, i) => [f, m[i + 1]])),
  );
  if (rows.length === 0)
    throw new Error(`No records parsed from ${file} — its literal shape changed.`);
  return rows;
}

const field = (name) => `\\s*${name}: "([^"]*)",`;

/** Curated airports: iata + the place words that make a good image query. */
const readAirports = () =>
  extract(
    "airports.ts",
    new RegExp(
      `\\{${field("iata")}[\\s\\S]{0,400}?${field("cityName")}[\\s\\S]{0,600}?${field("country")}`,
      "g",
    ),
    ["iata", "cityName", "country"],
  );

const readRegions = () =>
  extract("regions.ts", new RegExp(`\\{${field("slug")}${field("name")}`, "g"), ["slug", "name"]);

const readServices = () =>
  extract("services.ts", new RegExp(`\\{${field("slug")}${field("name")}`, "g"), ["slug", "name"]);

/**
 * Editorial overrides: slots where a human picked the photo, keyed to a Pexels
 * id. Pinned slots are fetched by id instead of searched, so `--force` re-runs
 * refresh their metadata without silently replacing the chosen image.
 */
const PINNED = {
  // Aerial of a coastal road winding down to Kaputaş beach — roads, cars and
  // Mediterranean water in one frame, which is the product in a picture.
  "fallback:hero": 18753973,
};

const MANIFEST_PATH = new URL("../src/data/place-images.json", import.meta.url);
const ENV_FILES = [".env.local", ".env"];
const API = "https://api.pexels.com/v1/search";

/** Free tier is 200 req/hour; 900ms between calls leaves generous headroom. */
const THROTTLE_MS = 900;
/** Candidates to pull per slot — enough to score, cheap enough to stay in budget. */
const PER_PAGE = 8;

// ---------------------------------------------------------------- env loading

/** Minimal .env reader — avoids a dotenv dependency for a build-only script. */
async function loadEnv() {
  for (const file of ENV_FILES) {
    if (!existsSync(file)) continue;
    const text = await readFile(file, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
      if (!match) continue;
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[match[1]]) process.env[match[1]] = value;
    }
  }
  return process.env.PEXELS_API_KEY;
}

// ------------------------------------------------------------------ the slots

/**
 * Every image slot the site needs, keyed `<kind>:<slug>`.
 *
 * `query` is what we ask Pexels for and `expect` are the words that should show
 * up in a good result's alt text — scoring uses them to reject the generic
 * stock filler that broad queries attract.
 */
async function buildSlots() {
  const slots = [];
  const add = (key, query, expect, note) => slots.push({ key, query, expect, note });

  // Market countries — the hub pages, and the fallback for anything inside them.
  for (const market of MARKETS) {
    add(`country:${market.slug}`, `${market.name} landmark cityscape`, [market.name], market.name);
  }

  // Regions of Crete.
  for (const region of await readRegions()) {
    add(
      `region:${region.slug}`,
      `${region.name} Crete Greece`,
      [region.name, "crete"],
      region.name,
    );
  }

  // Curated airports — city imagery reads far better than terminal interiors.
  for (const airport of await readAirports()) {
    add(
      `airport:${airport.iata}`,
      `${airport.cityName} ${airport.country} travel`,
      [airport.cityName, airport.country],
      `${airport.cityName} (${airport.iata})`,
    );
  }

  // Shell airport hubs for the non-Greece markets.
  for (const hub of MARKET_HUB_AIRPORTS) {
    const country = MARKETS.find((m) => m.slug === hub.countrySlug)?.name ?? "";
    add(
      `airport:${hub.iata}`,
      `${hub.cityName} ${country} city`,
      [hub.cityName, country].filter(Boolean),
      `${hub.name} (${hub.iata})`,
    );
  }

  // City hubs across the live markets.
  for (const city of MARKET_HUB_CITIES) {
    const country = MARKETS.find((m) => m.slug === city.countrySlug)?.name ?? "";
    add(
      `city:${city.slug}`,
      `${city.name} ${country}`,
      [city.name, country].filter(Boolean),
      city.name,
    );
  }

  // Crete destinations.
  for (const destination of DESTINATIONS) {
    const place = [destination.name, destination.island].filter(Boolean).join(" ");
    add(
      `city:${destination.slug}`,
      `${place} Greece`,
      [destination.name, destination.island].filter(Boolean),
      destination.name,
    );
  }

  // Every country that has an airport in the IATA catalog. This is what gives
  // the ~8,900 generated airport pages a picture of the right country instead
  // of one shared stock terminal, and it is the floor of the fallback chain.
  const countriesWithAirports = new Set(IATA_AIRPORTS.map((row) => row[3]));
  for (const code of [...countriesWithAirports].sort()) {
    const name = IATA_COUNTRY_NAMES[code];
    if (!name) continue;
    add(`country:${code}`, `${name} landscape landmark`, [name], name);
  }

  // The world's major hubs — the airports users actually search for, so they
  // get their own city photo rather than the country-level fallback.
  for (const iata of FEATURED_IATA) {
    const row = iataByCode.get(iata);
    const city = row?.[2];
    if (!city) continue;
    const country = IATA_COUNTRY_NAMES[row[3]] ?? "";
    add(
      `airport:${iata}`,
      `${city} ${country} city`,
      [city, country].filter(Boolean),
      `${row[1]} (${iata})`,
    );
  }

  // Service pages — thematic rather than geographic.
  const serviceQueries = {
    "airport-transfers": "airport arrivals terminal traveller luggage",
    "port-transfers": "ferry port harbour mediterranean boat",
    "hotel-transfers": "luxury hotel entrance resort lobby arrival",
    "private-tours": "scenic mountain village tour travellers",
    "long-distance": "coastal highway road trip car aerial",
    "group-transfers": "minivan group travellers luggage",
  };
  for (const service of await readServices()) {
    add(
      `service:${service.slug}`,
      serviceQueries[service.slug] ?? `${service.name} transfer`,
      [],
      service.name,
    );
  }

  // Generic fallbacks — the resolver's last resort, so they must always exist.
  add("fallback:airport", "airport terminal window aircraft", [], "Generic airport");
  add("fallback:city", "european city street evening", [], "Generic city");
  add("fallback:road", "coastal highway road car aerial", [], "Generic road");
  add("fallback:hero", "mediterranean coast road sunset aerial", [], "Generic hero");

  // De-duplicate: several airports share a city, and first definition wins.
  const seen = new Set();
  return slots.filter((slot) => !seen.has(slot.key) && seen.add(slot.key));
}

// ----------------------------------------------------------------- api + pick

async function searchPexels(apiKey, query) {
  const url = `${API}?query=${encodeURIComponent(query)}&per_page=${PER_PAGE}&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: apiKey } });

  if (res.status === 429) {
    const reset = res.headers.get("x-ratelimit-reset");
    throw Object.assign(new Error(`Pexels rate limit hit. Resets at ${resetLabel(reset)}.`), {
      rateLimited: true,
    });
  }
  if (!res.ok) throw new Error(`Pexels ${res.status} for "${query}"`);

  const body = await res.json();
  return {
    photos: body.photos ?? [],
    remaining: Number(res.headers.get("x-ratelimit-remaining") ?? NaN),
  };
}

/** Fetch one photo by id, for pinned slots. */
async function getPexelsPhoto(apiKey, id) {
  const res = await fetch(`https://api.pexels.com/v1/photos/${id}`, {
    headers: { Authorization: apiKey },
  });
  if (res.status === 429) {
    throw Object.assign(new Error("Pexels rate limit hit."), { rateLimited: true });
  }
  if (!res.ok) throw new Error(`Pexels ${res.status} for photo ${id}`);
  return {
    photos: [await res.json()],
    remaining: Number(res.headers.get("x-ratelimit-remaining") ?? NaN),
  };
}

function resetLabel(unix) {
  if (!unix) return "unknown";
  return new Date(Number(unix) * 1000).toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

/**
 * Penalty applied to a photo another slot already claimed. Deliberately a
 * penalty and not a ban: neighbouring villages often have no distinct coverage
 * on Pexels, and a shared photo of the right island beats a unique photo of
 * the wrong place. A clearly-relevant alternative still outranks the reuse.
 */
const REUSE_PENALTY = 45;

/**
 * Picks the best of the returned candidates.
 *
 * Deterministic on purpose: re-running the script must not reshuffle imagery
 * that is already live, so the score never uses randomness or result order
 * alone. Highest score wins, ties break on the lower photo id.
 */
function pickBest(photos, expect, usedIds = new Set()) {
  const wanted = expect.map((word) => word.toLowerCase()).filter(Boolean);

  const scored = photos.map((photo) => {
    let score = 0;
    const alt = (photo.alt ?? "").toLowerCase();

    // Relevance: the alt text naming the place is the strongest signal we get.
    for (const word of wanted) if (alt.includes(word)) score += 30;

    // Shape: heroes are wide crops, so favour landscape near 3:2–16:9.
    const ratio = photo.width / photo.height;
    if (ratio >= 1.3 && ratio <= 2.2) score += 15;
    else if (ratio < 1.1) score -= 25;

    // Resolution: enough pixels for a 2400px-wide hero.
    if (photo.width >= 3000) score += 10;
    else if (photo.width >= 1920) score += 5;
    else score -= 10;

    // Very dark or blown-out frames make poor backdrops for overlaid text.
    const luma = avgLuma(photo.avg_color);
    if (luma !== null && (luma < 30 || luma > 225)) score -= 10;

    // Spread the library: don't hand the same frame to page after page.
    if (usedIds.has(photo.id)) score -= REUSE_PENALTY;

    return { photo, score };
  });

  scored.sort((a, b) => b.score - a.score || a.photo.id - b.photo.id);
  return scored[0]?.photo ?? null;
}

function avgLuma(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex ?? "")) return null;
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
}

/** Trims the API payload to the fields the site actually renders. */
function toEntry(photo, query) {
  return {
    id: photo.id,
    // Attribution — required by the Pexels API guidelines, rendered by <PhotoCredit>.
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    pexelsUrl: photo.url,
    alt: photo.alt ?? "",
    avgColor: photo.avg_color ?? "#8a8a8a",
    width: photo.width,
    height: photo.height,
    // Base file: the resolver appends its own sizing params per usage.
    src: photo.src.original,
    query,
  };
}

// ------------------------------------------------------------------- the main

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const dryRun = args.includes("--dry-run");
  const only = args
    .find((a) => a.startsWith("--only="))
    ?.slice("--only=".length)
    .split(",")
    .filter(Boolean);

  const apiKey = await loadEnv();
  if (!apiKey && !dryRun) {
    console.error("PEXELS_API_KEY is not set. Add it to .env.local (see .env.example).");
    process.exit(1);
  }

  const manifest = existsSync(MANIFEST_PATH)
    ? JSON.parse(await readFile(MANIFEST_PATH, "utf8"))
    : { generatedAt: null, source: "pexels", images: {} };

  let slots = await buildSlots();
  if (only) slots = slots.filter((slot) => only.includes(slot.key));

  const pending = force ? slots : slots.filter((slot) => !manifest.images[slot.key]);

  console.log(
    `${slots.length} slots · ${manifest.images ? Object.keys(manifest.images).length : 0} cached · ${pending.length} to fetch`,
  );

  if (dryRun) {
    for (const slot of pending) console.log(`  ${slot.key.padEnd(38)} ← "${slot.query}"`);
    return;
  }
  if (pending.length === 0) {
    console.log("Nothing to do. Pass --force to re-resolve.");
    return;
  }

  let resolved = 0;
  let missed = 0;

  // Photos already spoken for — by a cached slot or by one resolved in this run.
  const pendingKeys = new Set(pending.map((slot) => slot.key));
  const usedIds = new Set(
    Object.entries(manifest.images)
      .filter(([key]) => !pendingKeys.has(key))
      .map(([, entry]) => entry.id),
  );

  for (const [index, slot] of pending.entries()) {
    try {
      const pin = PINNED[slot.key];
      const { photos, remaining } = pin
        ? await getPexelsPhoto(apiKey, pin)
        : await searchPexels(apiKey, slot.query);
      // A pinned slot takes its photo as given; scoring only applies to searches.
      const best = pin ? (photos[0] ?? null) : pickBest(photos, slot.expect, usedIds);

      if (!best) {
        missed++;
        console.warn(`  ✗ ${slot.key} — no usable result for "${slot.query}"`);
      } else {
        manifest.images[slot.key] = toEntry(best, slot.query);
        usedIds.add(best.id);
        resolved++;
        const progress = `${index + 1}/${pending.length}`.padStart(7);
        console.log(`  ${progress} ${slot.key.padEnd(38)} ${best.id} ${trim(best.alt)}`);
      }

      // Checkpoint often: a rate limit or Ctrl-C must not lose finished work.
      if (resolved % 10 === 0) await save(manifest);
      if (Number.isFinite(remaining) && remaining < 5) {
        console.warn(`Stopping: only ${remaining} requests left this period.`);
        break;
      }
    } catch (error) {
      if (error.rateLimited) {
        console.warn(`\n${error.message}\nProgress saved — re-run to continue.`);
        break;
      }
      missed++;
      console.warn(`  ✗ ${slot.key} — ${error.message}`);
    }

    await new Promise((r) => setTimeout(r, THROTTLE_MS));
  }

  await save(manifest);
  console.log(
    `\nResolved ${resolved}, missed ${missed}. Manifest: ${Object.keys(manifest.images).length} images.`,
  );
}

function trim(text) {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  return clean.length > 52 ? `${clean.slice(0, 52)}…` : clean;
}

async function save(manifest) {
  manifest.generatedAt = new Date().toISOString();
  const ordered = Object.fromEntries(
    Object.entries(manifest.images).sort(([a], [b]) => a.localeCompare(b)),
  );
  await writeFile(MANIFEST_PATH, `${JSON.stringify({ ...manifest, images: ordered }, null, 2)}\n`);
}

await main();
