#!/usr/bin/env node
/**
 * Regenerates src/data/iata-airports.json from OurAirports open data.
 * Usage: npm run generate:airports
 */
import { mkdir, writeFile } from "node:fs/promises";

const AIRPORTS_URL = "https://davidmegginson.github.io/ourairports-data/airports.csv";
const COUNTRIES_URL = "https://davidmegginson.github.io/ourairports-data/countries.csv";

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.text();
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    return row;
  });
}

function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQ = !inQ;
    } else if (c === "," && !inQ) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

const TYPE_OK = new Set(["large_airport", "medium_airport", "small_airport"]);

async function main() {
  await mkdir("scripts/data", { recursive: true });
  const [airportsText, countriesText] = await Promise.all([
    fetchText(AIRPORTS_URL),
    fetchText(COUNTRIES_URL),
  ]);
  await writeFile("scripts/data/airports.csv", airportsText);
  await writeFile("scripts/data/countries.csv", countriesText);

  const countries = {};
  for (const row of parseCsv(countriesText)) {
    countries[row.code] = row.name;
  }

  const seen = new Set();
  const out = [];
  for (const row of parseCsv(airportsText)) {
    const iata = (row.iata_code || "").trim().toUpperCase();
    if (!iata || iata.length !== 3 || seen.has(iata)) continue;
    const typ = row.type || "";
    if (typ === "closed") continue;
    if (!TYPE_OK.has(typ) && row.scheduled_service !== "yes") continue;
    const lat = Number(row.latitude_deg);
    const lng = Number(row.longitude_deg);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    const name = (row.name || "").trim();
    const city = (row.municipality || "").trim();
    const cc = (row.iso_country || "").trim().toUpperCase();
    if (!name || !cc) continue;
    seen.add(iata);
    out.push([iata, name, city, cc, Math.round(lat * 1e5) / 1e5, Math.round(lng * 1e5) / 1e5]);
  }
  out.sort((a, b) => a[0].localeCompare(b[0]));

  const used = [...new Set(out.map((a) => a[3]))].sort();
  const countryMap = Object.fromEntries(used.map((cc) => [cc, countries[cc] || cc]));

  const payload = JSON.stringify({ countries: countryMap, airports: out });
  await writeFile("src/data/iata-airports.json", payload);
  console.log(
    `Wrote ${out.length} airports → src/data/iata-airports.json (${Math.round(payload.length / 1024)} KB)`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
