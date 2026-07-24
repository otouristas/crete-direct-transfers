export type LatLng = { lat: number; lng: number };

/** Roughly central Crete — fallback map centre when nothing else resolves. */
export const CRETE_CENTER: LatLng = { lat: 35.24, lng: 24.81 };

/** Known airports / towns used by the preset routes and demo data. */
const KNOWN: { match: string[]; at: LatLng }[] = [
  { match: ["heraklion airport", "her)", "(her"], at: { lat: 35.3397, lng: 25.1803 } },
  { match: ["heraklion city", "heraklion town", "heraklion"], at: { lat: 35.3387, lng: 25.1442 } },
  { match: ["chania airport", "chq)", "(chq"], at: { lat: 35.5317, lng: 24.1497 } },
  { match: ["chania"], at: { lat: 35.5138, lng: 24.018 } },
  { match: ["rethymno old town", "rethymno"], at: { lat: 35.3686, lng: 24.4741 } },
  { match: ["elounda"], at: { lat: 35.2597, lng: 25.7245 } },
  { match: ["agios nikolaos"], at: { lat: 35.191, lng: 25.716 } },
  { match: ["barcelona airport", "bcn)", "(bcn"], at: { lat: 41.2974, lng: 2.0833 } },
  { match: ["barcelona"], at: { lat: 41.3874, lng: 2.1686 } },
];

/** Best-effort geocode of a free-text address by keyword; null when unknown. */
export function resolveCoords(address?: string | null): LatLng | null {
  if (!address) return null;
  const a = address.toLowerCase();
  for (const entry of KNOWN) {
    if (entry.match.some((m) => a.includes(m))) return entry.at;
  }
  return null;
}
