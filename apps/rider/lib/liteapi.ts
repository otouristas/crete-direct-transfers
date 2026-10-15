import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

async function callLiteapi(action: string, body: Record<string, unknown>) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error("Supabase not configured");
  const headers: Record<string, string> = {
    "content-type": "application/json",
    apikey: SUPABASE_ANON_KEY,
  };
  if (SUPABASE_ANON_KEY.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`;
  }
  const res = await fetch(`${SUPABASE_URL}/functions/v1/liteapi`, {
    method: "POST",
    headers,
    body: JSON.stringify({ action, ...body }),
  });
  const text = await res.text();
  if (!text) throw new Error(`LiteAPI empty (${res.status})`);
  const data = JSON.parse(text) as Record<string, unknown>;
  if (!res.ok) throw new Error(String(data.error || `LiteAPI ${res.status}`));
  return data;
}

export const liteapiMobile = {
  places: (textQuery: string, type?: string) => callLiteapi("places", { textQuery, type }),
  hotelRates: (body: Record<string, unknown>) => callLiteapi("hotel-rates", body),
  hotelDetails: (hotelId: string) => callLiteapi("hotel-details", { hotelId }),
  hotelPrebook: (offerId: string) => callLiteapi("hotel-prebook", { offerId }),
  hotelBook: (body: Record<string, unknown>) => callLiteapi("hotel-book", body),
  flightRates: (body: Record<string, unknown>) => callLiteapi("flight-rates", body),
  flightPrebook: (body: Record<string, unknown>) => callLiteapi("flight-prebook", body),
  flightBook: (body: Record<string, unknown>) => callLiteapi("flight-book", body),
};
