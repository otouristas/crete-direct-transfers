// Canonical airport URL slugs. Every airport slug ends in `-<iata>` (lowercase),
// so the IATA code — and therefore the airport — can always be recovered from
// the slug. This holds for both the curated `AIRPORTS` and generated global
// airports, which is what lets `airports.$slug` resolve any of the 8,927 IATA
// airports without a per-airport route.

/** Lowercase, strip diacritics, collapse to hyphens. */
export function kebab(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** `Heathrow Airport` (LHR) in London → `london-airport-transfers-lhr`. */
export function airportSlug(a: { iata: string; name: string; city?: string }): string {
  const base = a.city && a.city.trim() ? a.city : a.name;
  return `${kebab(base)}-airport-transfers-${a.iata.toLowerCase()}`;
}

/** Recover the IATA code from any airport slug (trailing 3-letter token). */
export function iataFromSlug(slug: string): string | null {
  const last = slug.split("-").pop() ?? "";
  return /^[a-z]{3}$/.test(last) ? last.toUpperCase() : null;
}
