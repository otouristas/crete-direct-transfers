import { supabase } from "@/integrations/supabase/client";
import { matchRouteSlug, type PlaceResult } from "@/lib/place-search";
import { computeQuotePrice } from "@/lib/quote-engine";
import { VEHICLE_CLASSES, getRoute, type VehicleClass } from "@/data/routes";

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(x)) * 1.35 * 10) / 10;
}

export type AsapDispatchStatus = {
  bookingId: string;
  status: string;
  urgency: string;
  etaMinutes: number | null;
  expiresAt: string | null;
  priceCents: number;
  currency: string;
  pickupAddress: string | null;
  dropoffAddress: string | null;
  driverFirstName: string | null;
  expired: boolean;
};

export type AsapCreateInput = {
  from: PlaceResult;
  to: PlaceResult;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pax?: number;
  vehicleClass?: string;
  notes?: string;
};

const CRETE_IATAS = new Set(["HER", "CHQ"]);

/** Crete instant corridors only for ASAP v1. */
export function canRequestAsap(from: PlaceResult, to: PlaceResult): boolean {
  const fromCrete =
    from.countryCode === "GR" ||
    (from.iata != null && CRETE_IATAS.has(from.iata)) ||
    /crete|heraklion|chania|rethymno|elounda|domotel/i.test(from.label);
  const toCrete =
    to.countryCode === "GR" ||
    (to.iata != null && CRETE_IATAS.has(to.iata)) ||
    /crete|heraklion|chania|rethymno|elounda|domotel|mali|hersonissos/i.test(to.label);
  return Boolean(fromCrete && toCrete && from.lat != null && to.lat != null);
}

export function detectAsapIntent(text: string): boolean {
  return /\b(now|asap|immediately|right now|urgent|as soon as possible|transfert maintenant|jetzt|τώρα)\b/i.test(
    text,
  );
}

export async function createAsapBooking(input: AsapCreateInput): Promise<{
  bookingId: string;
  priceCents: number;
  etaHintMinutes: number;
  routeSlug: string;
  expiresAt?: string;
}> {
  if (!canRequestAsap(input.from, input.to)) {
    throw new Error("asap_not_available");
  }

  const routeSlug =
    matchRouteSlug(input.from, input.to) ??
    `distance-${Math.round(
      input.from.lat != null &&
        input.to.lat != null &&
        input.from.lng != null &&
        input.to.lng != null
        ? haversineKm(
            { lat: input.from.lat, lng: input.from.lng },
            { lat: input.to.lat, lng: input.to.lng },
          )
        : 40,
    )}km`;

  const distanceKm =
    input.from.lat != null && input.to.lat != null && input.from.lng != null && input.to.lng != null
      ? haversineKm(
          { lat: input.from.lat, lng: input.from.lng },
          { lat: input.to.lat, lng: input.to.lng },
        )
      : undefined;

  const vehicleClass = (input.vehicleClass ?? "economy") as VehicleClass;
  if (!VEHICLE_CLASSES.some((v) => v.id === vehicleClass)) {
    throw new Error("vehicle_invalid");
  }
  const priced = computeQuotePrice({
    routeSlug,
    vehicleClass,
    pickupAt: new Date().toISOString(),
    distanceKm: distanceKm ?? null,
    tripType: "oneway",
  });
  if (!priced) throw new Error("price_unavailable");

  const catalog = getRoute(routeSlug);
  const etaHint =
    catalog?.durationMin ?? (distanceKm != null ? Math.max(20, Math.round(distanceKm * 1.2)) : 35);

  const { data, error } = await supabase.rpc("create_asap_booking", {
    p_route_slug: routeSlug,
    p_vehicle_class: vehicleClass,
    p_passengers: input.pax ?? 2,
    p_customer_name: input.customerName,
    p_customer_email: input.customerEmail,
    p_customer_phone: input.customerPhone,
    p_pickup_address: input.from.label,
    p_dropoff_address: input.to.label,
    p_price_cents: priced.priceCents,
    p_eta_hint_minutes: etaHint,
    p_notes: input.notes ?? undefined,
    p_pickup_lat: input.from.lat ?? undefined,
    p_pickup_lng: input.from.lng ?? undefined,
    p_dropoff_lat: input.to.lat ?? undefined,
    p_dropoff_lng: input.to.lng ?? undefined,
  });

  if (error) throw error;
  const row = data as { id: string; price_cents: number; asap_expires_at?: string };
  return {
    bookingId: row.id,
    priceCents: row.price_cents,
    etaHintMinutes: etaHint,
    routeSlug,
    expiresAt: row.asap_expires_at,
  };
}

export async function getAsapDispatchStatus(bookingId: string): Promise<AsapDispatchStatus | null> {
  const { data, error } = await supabase.rpc("get_asap_dispatch_status", {
    p_booking_id: bookingId,
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;
  const r = row as Record<string, unknown>;
  return {
    bookingId: String(r.booking_id),
    status: String(r.status),
    urgency: String(r.urgency ?? "asap"),
    etaMinutes: r.eta_minutes == null ? null : Number(r.eta_minutes),
    expiresAt: r.expires_at == null ? null : String(r.expires_at),
    priceCents: Number(r.price_cents ?? 0),
    currency: String(r.currency ?? "EUR"),
    pickupAddress: r.pickup_address == null ? null : String(r.pickup_address),
    dropoffAddress: r.dropoff_address == null ? null : String(r.dropoff_address),
    driverFirstName: r.driver_first_name == null ? null : String(r.driver_first_name),
    expired: Boolean(r.expired),
  };
}

export async function setDriverOnline(online: boolean) {
  const { data, error } = await supabase.rpc("set_driver_online", { p_online: online });
  if (error) throw error;
  return data;
}

export type AsapDispatchEvent = {
  id: string;
  booking_id: string;
  route_slug: string;
  vehicle_class: string;
  passengers: number;
  pickup_address: string | null;
  dropoff_address: string | null;
  price_cents: number;
  currency: string;
  eta_hint_minutes: number | null;
  expires_at: string;
  created_at: string;
};

export async function listAsapDispatchEvents(): Promise<AsapDispatchEvent[]> {
  const { data, error } = await supabase
    .from("asap_dispatch_events")
    .select("*")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AsapDispatchEvent[];
}

/** Subscribe to ASAP fanout inserts for online drivers. */
export function subscribeAsapDispatch(
  onInsert: (row: AsapDispatchEvent) => void,
  onDelete?: (bookingId: string) => void,
) {
  const channel = supabase
    .channel("asap-dispatch")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "asap_dispatch_events" },
      (payload) => {
        onInsert(payload.new as AsapDispatchEvent);
      },
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "asap_dispatch_events" },
      (payload) => {
        const old = payload.old as { booking_id?: string };
        if (old.booking_id) onDelete?.(old.booking_id);
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

export type UiDispatchStatus = NonNullable<
  import("@/lib/touristas-ai/types").AssistantResponse["dispatch"]
>["status"];

export function mapAsapStatusToUi(status: AsapDispatchStatus): {
  status: UiDispatchStatus;
  driverName?: string;
  etaMinutes?: number;
} {
  if (status.expired || status.status === "cancelled") {
    return { status: status.expired ? "expired" : "cancelled" };
  }
  if (status.status === "claimed") {
    return {
      status: "claimed",
      driverName: status.driverFirstName ?? undefined,
      etaMinutes: status.etaMinutes ?? undefined,
    };
  }
  if (status.status === "en_route") {
    return {
      status: "en_route",
      driverName: status.driverFirstName ?? undefined,
      etaMinutes: status.etaMinutes ?? undefined,
    };
  }
  if (status.status === "pending") {
    return { status: "searching" };
  }
  return { status: "failed" };
}

/** Poll ASAP status for chat (guest-safe RPC). Optional Realtime on bookings when allowed. */
export function watchAsapBooking(
  bookingId: string,
  onUpdate: (status: AsapDispatchStatus) => void,
  opts?: { intervalMs?: number },
) {
  let stopped = false;
  const intervalMs = opts?.intervalMs ?? 2500;

  const pull = async () => {
    if (stopped) return;
    try {
      const status = await getAsapDispatchStatus(bookingId);
      if (status && !stopped) onUpdate(status);
      if (
        status &&
        (status.expired ||
          status.status === "claimed" ||
          status.status === "en_route" ||
          status.status === "cancelled" ||
          status.status === "completed")
      ) {
        stop();
      }
    } catch {
      /* keep polling */
    }
  };

  void pull();
  const timer = window.setInterval(() => void pull(), intervalMs);

  const channel = supabase
    .channel(`asap-booking-${bookingId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "bookings",
        filter: `id=eq.${bookingId}`,
      },
      () => {
        void pull();
      },
    )
    .subscribe();

  function stop() {
    if (stopped) return;
    stopped = true;
    window.clearInterval(timer);
    void supabase.removeChannel(channel);
  }

  return stop;
}
