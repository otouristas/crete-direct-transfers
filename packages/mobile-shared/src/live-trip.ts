import { useEffect, useState } from "react";
import { AppState } from "react-native";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database";

export type TripLocation = Database["public"]["Tables"]["trip_locations"]["Row"];
export type LiveConnection = "connecting" | "connected" | "reconnecting";
export type LiveBooking = Database["public"]["Tables"]["bookings"]["Row"];

export function useRealtimeBooking(client: SupabaseClient<Database>, bookingId?: string) {
  const [booking, setBooking] = useState<LiveBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }
    let alive = true;
    let revision = 0;
    let readSequence = 0;
    setLoading(true);
    setBooking(null);
    const refresh = async () => {
      const serial = revision;
      const request = ++readSequence;
      const { data, error: e } = await client
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .maybeSingle();
      if (!alive || request !== readSequence) return;
      if (e) setError("Your trip could not be refreshed. Check your connection.");
      else if (serial === revision) {
        setBooking(data);
        setError(null);
      }
      setLoading(false);
    };
    const channel = client
      .channel(`trip-status:${bookingId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings", filter: `id=eq.${bookingId}` },
        (event) => {
          // Postgres DELETE events cannot be server-filtered like INSERT/UPDATE.
          if (event.eventType === "DELETE" && event.old.id !== bookingId) return;
          revision++;
          if (alive) {
            setBooking(event.eventType === "DELETE" ? null : (event.new as LiveBooking));
            setLoading(false);
          }
        },
      );
    void client.auth
      .getSession()
      .then(async ({ data }) => {
        await client.realtime.setAuth(data.session?.access_token ?? null);
        if (alive)
          channel.subscribe((status) => {
            if (status === "SUBSCRIBED") void refresh();
          });
      })
      .catch(() => {
        if (alive) setError("Your trip connection is reconnecting.");
      });
    void refresh();
    const interval = setInterval(() => {
      if (AppState.currentState === "active") void refresh();
    }, 15000);
    const appState = AppState.addEventListener("change", (s) => {
      if (s === "active") void refresh();
    });
    return () => {
      alive = false;
      clearInterval(interval);
      appState.remove();
      void client.removeChannel(channel);
    };
  }, [client, bookingId]);
  return { booking, loading, error };
}

export function bookingPoint(value: unknown): { lat: number; lng: number } | null {
  if (!value || typeof value !== "object") return null;
  const p = value as Record<string, unknown>;
  const lat = Number(p.lat ?? p.latitude),
    lng = Number(p.lng ?? p.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
    ? { lat, lng }
    : null;
}

/** Subscribe before reading; re-read after reconnect so events cannot leave a gap. */
export function useLiveTrip(client: SupabaseClient<Database>, bookingId?: string) {
  const [position, setPosition] = useState<TripLocation | null>(null);
  const [connection, setConnection] = useState<LiveConnection>("connecting");
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!bookingId) {
      setPosition(null);
      return;
    }
    let alive = true;
    let revision = 0;
    let readSequence = 0;
    setPosition(null);
    setConnection("connecting");
    const refresh = async () => {
      const serial = revision;
      const request = ++readSequence;
      const { data, error } = await client
        .from("trip_locations")
        .select("*")
        .eq("booking_id", bookingId)
        .maybeSingle();
      if (alive && !error && serial === revision && request === readSequence) setPosition(data);
    };
    const channel = client.channel(`trip-gps:${bookingId}`).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "trip_locations",
        filter: `booking_id=eq.${bookingId}`,
      },
      (event) => {
        if (event.eventType === "DELETE" && event.old.booking_id !== bookingId) return;
        revision++;
        if (!alive) return;
        if (event.eventType === "DELETE") setPosition(null);
        else {
          const next = event.new as TripLocation;
          setPosition((old) => (!old || next.captured_at > old.captured_at ? next : old));
        }
      },
    );
    void client.auth
      .getSession()
      .then(async ({ data }) => {
        await client.realtime.setAuth(data.session?.access_token ?? null);
        if (!alive) return;
        channel.subscribe((status) => {
          if (!alive) return;
          if (status === "SUBSCRIBED") {
            setConnection("connected");
            void refresh();
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED")
            setConnection("reconnecting");
        });
      })
      .catch(() => {
        if (alive) setConnection("reconnecting");
      });
    void refresh();
    // This is recovery while disconnected; GPS delivery itself uses Realtime.
    const fallback = setInterval(() => {
      if (AppState.currentState === "active") void refresh();
    }, 15000);
    const foreground = AppState.addEventListener("change", (s) => {
      if (s === "active") void refresh();
    });
    return () => {
      alive = false;
      foreground.remove();
      clearInterval(fallback);
      void client.removeChannel(channel);
    };
  }, [client, bookingId]);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const ageSeconds = position
    ? Math.max(0, Math.floor((now - Date.parse(position.captured_at)) / 1000))
    : null;
  const fresh = ageSeconds !== null && ageSeconds <= 20 && connection === "connected";
  return { position, connection, fresh, ageSeconds };
}

export async function advanceTrip(
  client: SupabaseClient<Database>,
  bookingId: string,
  stage: "at_pickup" | "on_trip",
) {
  const { data, error } = await client.rpc("advance_trip", {
    p_booking_id: bookingId,
    p_stage: stage,
  });
  if (error) throw error;
  return data;
}
