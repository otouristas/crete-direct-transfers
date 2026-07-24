/** Map ISO country codes / place hints to TransferAround market slugs. */
export type DispatchMarket = "greece" | "spain" | "italy";

const COUNTRY_TO_MARKET: Record<string, DispatchMarket> = {
  GR: "greece",
  ES: "spain",
  IT: "italy",
};

export function marketFromCountryCode(code?: string | null): DispatchMarket {
  if (!code) return "greece";
  return COUNTRY_TO_MARKET[code.toUpperCase()] ?? "greece";
}

export function defaultDispatchMode(market: DispatchMarket): "offer" | "partner_assign" {
  return market === "greece" ? "offer" : "partner_assign";
}

export type LatLng = { lat: number; lng: number };

export function parsePickupPoint(point: unknown): LatLng | null {
  if (!point || typeof point !== "object") return null;
  const p = point as Record<string, unknown>;
  const lat = typeof p.lat === "number" ? p.lat : Number(p.lat);
  const lng = typeof p.lng === "number" ? p.lng : Number(p.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}
