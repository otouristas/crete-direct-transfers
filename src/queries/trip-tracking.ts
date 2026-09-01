import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isDemoBookingId } from "@/data/demo-bookings";
import { haversineEstimate } from "@/lib/trip-route";

export type TripStage = "to_pickup" | "waiting" | "on_trip";

export type TripLocation = {
  booking_id: string;
  driver_id: string;
  lat: number;
  lng: number;
  heading: number | null;
  speed_kph: number | null;
  eta_minutes: number | null;
  distance_km: number | null;
  stage: TripStage;
  updated_at: string;
};

type Coords = { lat: number; lng: number };

/** Driver publishes their current position for a job they are assigned to. */
export async function pingDriverLocation(input: {
  bookingId: string;
  lat: number;
  lng: number;
  heading?: number | null;
  speedKph?: number | null;
  etaMinutes?: number | null;
  distanceKm?: number | null;
  stage?: TripStage;
}): Promise<void> {
  if (isDemoBookingId(input.bookingId)) return;
  const { error } = await supabase.rpc("ping_driver_location", {
    p_booking_id: input.bookingId,
    p_lat: input.lat,
    p_lng: input.lng,
    p_heading: input.heading ?? undefined,
    p_speed_kph: input.speedKph ?? undefined,
    p_eta_minutes: input.etaMinutes ?? undefined,
    p_distance_km: input.distanceKm ?? undefined,
    p_stage: input.stage ?? "to_pickup",
  });
  if (error) throw error;
}

async function fetchTripLocation(bookingId: string): Promise<TripLocation | null> {
  const { data, error } = await supabase
    .from("trip_locations")
    .select("*")
    .eq("booking_id", bookingId)
    .maybeSingle();
  if (error) throw error;
  return (data as TripLocation | null) ?? null;
}

/**
 * Simulated driver approach for demo bookings, so the tracker can be reviewed
 * without a live driver. Moves along the pickup→dropoff line on a 90s loop.
 */
function simulate(bookingId: string, target: Coords | null, origin: Coords | null): TripLocation {
  const from = origin ?? { lat: 35.3397, lng: 25.1803 };
  const to = target ?? { lat: 35.3387, lng: 25.1442 };
  const loop = 90_000;
  const progress = (Date.now() % loop) / loop;
  const lat = from.lat + (to.lat - from.lat) * progress;
  const lng = from.lng + (to.lng - from.lng) * progress;
  const rest = haversineEstimate({ lat, lng }, to);
  return {
    booking_id: bookingId,
    driver_id: "demo-driver",
    lat,
    lng,
    heading: null,
    speed_kph: 62,
    eta_minutes: rest.durationMin,
    distance_km: rest.distanceKm,
    stage: progress > 0.92 ? "waiting" : "to_pickup",
    updated_at: new Date().toISOString(),
  };
}

/**
 * Live driver position for a booking: initial read plus a realtime
 * subscription, with a slow poll as a safety net. Demo bookings get a
 * simulated approach instead.
 */
export function useLiveTripLocation(
  bookingId: string,
  options: { enabled: boolean; approachFrom?: Coords | null; approachTo?: Coords | null },
): { location: TripLocation | null; isDemo: boolean; connected: boolean } {
  const { enabled, approachFrom, approachTo } = options;
  const demo = isDemoBookingId(bookingId);
  const [location, setLocation] = useState<TripLocation | null>(null);
  const [connected, setConnected] = useState(false);
  const fromKey = approachFrom ? `${approachFrom.lat},${approachFrom.lng}` : "";
  const toKey = approachTo ? `${approachTo.lat},${approachTo.lng}` : "";

  useEffect(() => {
    if (!enabled) {
      setLocation(null);
      setConnected(false);
      return;
    }

    if (demo) {
      const tick = () =>
        setLocation(simulate(bookingId, approachTo ?? null, approachFrom ?? null));
      tick();
      setConnected(true);
      const timer = window.setInterval(tick, 3000);
      return () => window.clearInterval(timer);
    }

    let active = true;
    const load = () => {
      fetchTripLocation(bookingId)
        .then((row) => {
          if (active) setLocation(row);
        })
        .catch(() => undefined);
    };
    load();
    const poll = window.setInterval(load, 30_000);

    const channel = supabase
      .channel(`trip-location-${bookingId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trip_locations",
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          const row = payload.new as TripLocation | null;
          if (row && active) setLocation(row);
        },
      )
      .subscribe((status) => {
        if (active) setConnected(status === "SUBSCRIBED");
      });

    return () => {
      active = false;
      window.clearInterval(poll);
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, enabled, demo, fromKey, toKey]);

  return useMemo(
    () => ({ location, isDemo: demo, connected }),
    [location, demo, connected],
  );
}

/** How stale a position is, in minutes. */
export function minutesSince(iso: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
}
