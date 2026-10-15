import type { Json } from "@/integrations/supabase/types";
import { createServerFn } from "@tanstack/react-start";
import { getServiceSupabase } from "@/integrations/supabase/service";
import {
  bookFlight,
  bookHotel,
  getHotelDetails,
  getHotelReviews,
  getLitePlace,
  LiteApiError,
  prebookFlight,
  prebookHotel,
  searchFlightRates,
  searchHotelRates,
  searchLitePlaces,
  type FlightRatesInput,
  type HotelRatesInput,
} from "@/server/liteapi";

function wrap<T>(fn: () => Promise<T>) {
  return fn().catch((e) => {
    if (e instanceof LiteApiError) {
      return { ok: false as const, error: e.message, status: e.status, data: null };
    }
    throw e;
  });
}

async function persistLiteSession(input: {
  kind: "hotel" | "flight";
  offerId?: string;
  prebookId?: string;
  transactionId?: string;
  secretKey?: string;
  payload?: Record<string, Json>;
}) {
  const sb = getServiceSupabase();
  if (!sb || !input.prebookId) return;
  try {
    // Table may not be in generated Database types yet.
    const client = sb as unknown as {
      from: (t: string) => {
        insert: (row: Record<string, Json>) => PromiseLike<{ error: { message: string } | null }>;
      };
    };
    await client.from("liteapi_sessions").insert({
      kind: input.kind,
      offer_id: input.offerId ?? null,
      prebook_id: input.prebookId,
      transaction_id: input.transactionId ?? null,
      secret_key: input.secretKey ?? null,
      payload: input.payload ?? {},
      status: "prebooked",
    });
  } catch {
    // Best-effort; checkout also uses sessionStorage.
  }
}

export const liteSearchPlaces = createServerFn({ method: "POST" })
  .inputValidator((d: { textQuery: string; type?: string }) => d)
  .handler(async ({ data }) => {
    const res = await wrap(() => searchLitePlaces(data.textQuery, data.type));
    if ("ok" in res && res.ok === false) return res;
    return { ok: true as const, data: (res as Awaited<ReturnType<typeof searchLitePlaces>>).data };
  });

export const liteGetPlace = createServerFn({ method: "POST" })
  .inputValidator((d: { placeId: string }) => d)
  .handler(async ({ data }) => {
    const res = await wrap(() => getLitePlace(data.placeId));
    if ("ok" in res && res.ok === false) return res;
    return { ok: true as const, data: (res as Awaited<ReturnType<typeof getLitePlace>>).data };
  });

export const liteHotelRates = createServerFn({ method: "POST" })
  .inputValidator((d: HotelRatesInput) => d)
  .handler(async ({ data }) => {
    const res = await wrap(() => searchHotelRates(data));
    if ("ok" in res && res.ok === false) return res;
    return { ok: true as const, data: res as Record<string, Json> };
  });

export const liteHotelDetails = createServerFn({ method: "POST" })
  .inputValidator((d: { hotelId: string }) => d)
  .handler(async ({ data }) => {
    const res = await wrap(() => getHotelDetails(data.hotelId));
    if ("ok" in res && res.ok === false) return res;
    return { ok: true as const, data: (res as Awaited<ReturnType<typeof getHotelDetails>>).data };
  });

export const liteHotelReviews = createServerFn({ method: "POST" })
  .inputValidator((d: { hotelId: string; limit?: number }) => d)
  .handler(async ({ data }) => {
    const res = await wrap(() => getHotelReviews(data.hotelId, data.limit ?? 12));
    if ("ok" in res && res.ok === false) return res;
    return { ok: true as const, data: (res as Awaited<ReturnType<typeof getHotelReviews>>).data };
  });

export const liteHotelPrebook = createServerFn({ method: "POST" })
  .inputValidator((d: { offerId: string }) => d)
  .handler(async ({ data }) => {
    const res = await wrap(() => prebookHotel(data.offerId));
    if ("ok" in res && res.ok === false) return res;
    const payload = (res as Awaited<ReturnType<typeof prebookHotel>>).data;
    const d = payload as {
      prebookId?: string;
      transactionId?: string;
      secretKey?: string;
    };
    await persistLiteSession({
      kind: "hotel",
      offerId: data.offerId,
      prebookId: d.prebookId,
      transactionId: d.transactionId,
      secretKey: d.secretKey,
      payload: d as Record<string, Json>,
    });
    return { ok: true as const, data: payload };
  });

export const liteGetSession = createServerFn({ method: "POST" })
  .inputValidator((d: { prebookId: string }) => d)
  .handler(async () => ({
    ok: false as const,
    error: "Use the checkout session on this device.",
    data: null,
  }));

export const liteHotelBook = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      prebookId: string;
      transactionId: string;
      holder: { firstName: string; lastName: string; email: string };
    }) => d,
  )
  .handler(async ({ data }) => {
    const res = await wrap(() => bookHotel(data));
    if ("ok" in res && res.ok === false) return res;
    return { ok: true as const, data: (res as Awaited<ReturnType<typeof bookHotel>>).data };
  });

export const liteFlightRates = createServerFn({ method: "POST" })
  .inputValidator((d: FlightRatesInput) => d)
  .handler(async ({ data }) => {
    const res = await wrap(() => searchFlightRates(data));
    if ("ok" in res && res.ok === false) return res;
    return { ok: true as const, data: res as Record<string, Json> };
  });

export const liteFlightPrebook = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      offerId: string;
      contact: { firstName: string; lastName: string; email: string; phone?: string };
      passengers: Array<Record<string, Json>>;
    }) => d,
  )
  .handler(async ({ data }) => {
    const res = await wrap(() => prebookFlight(data));
    if ("ok" in res && res.ok === false) return res;
    const payload = (res as Awaited<ReturnType<typeof prebookFlight>>).data;
    const d = payload as {
      prebookId?: string;
      transactionId?: string;
      secretKey?: string;
    };
    await persistLiteSession({
      kind: "flight",
      offerId: data.offerId,
      prebookId: d.prebookId,
      transactionId: d.transactionId,
      secretKey: d.secretKey,
      payload: d as Record<string, Json>,
    });
    return { ok: true as const, data: payload };
  });

export const liteFlightBook = createServerFn({ method: "POST" })
  .inputValidator((d: { prebookId: string; transactionId: string }) => d)
  .handler(async ({ data }) => {
    const res = await wrap(() =>
      bookFlight({
        prebookId: data.prebookId,
        transactionId: data.transactionId,
      }),
    );
    if ("ok" in res && res.ok === false) return res;
    return { ok: true as const, data: (res as Awaited<ReturnType<typeof bookFlight>>).data };
  });
