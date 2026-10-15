import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export function useLiveTrip(bookingId: string, active: boolean) {
  const cache = useQueryClient();
  const [position, setPosition] = useState<Tables<"trip_locations"> | null>(null);
  const [connection, setConnection] = useState("connecting");
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    setPosition(null);
    setConnection("connecting");
    if (!/^[a-f\d-]{36}$/i.test(bookingId)) return;
    let alive = true;
    let revision = 0;
    let sequence = 0;
    const read = async () => {
      if (!active) return;
      const before = revision;
      const request = ++sequence;
      const { data, error } = await supabase
        .from("trip_locations")
        .select("*")
        .eq("booking_id", bookingId)
        .maybeSingle();
      if (alive && !error && before === revision && request === sequence) setPosition(data);
    };
    const channel = supabase
      .channel(`web-trip:${bookingId}`)
      .on(
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
          if (!alive || !active) return;
          if (event.eventType === "DELETE") setPosition(null);
          else {
            const next = event.new as Tables<"trip_locations">;
            setPosition((old) => (!old || next.captured_at > old.captured_at ? next : old));
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `id=eq.${bookingId}`,
        },
        (event) => {
          if (event.eventType === "DELETE" && event.old.id !== bookingId) return;
          void cache.cancelQueries({ queryKey: ["booking", bookingId], exact: true }).then(() => {
            if (!alive) return;
            const next = event.eventType === "DELETE" ? null : (event.new as Tables<"bookings">);
            cache.setQueryData(["booking", bookingId], next);
            if (!next || !["claimed", "en_route"].includes(next.status)) setPosition(null);
            void cache.invalidateQueries({ queryKey: ["my-bookings"] });
            void cache.invalidateQueries({ queryKey: ["driver-jobs"] });
          });
        },
      );
    void supabase.auth
      .getSession()
      .then(async ({ data }) => {
        await supabase.realtime.setAuth(data.session?.access_token ?? null);
        if (!alive) return;
        channel.subscribe((status) => {
          if (!alive) return;
          if (status === "SUBSCRIBED") {
            setConnection("connected");
            void read();
          } else if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status))
            setConnection("reconnecting");
        });
      })
      .catch(() => {
        if (alive) setConnection("reconnecting");
      });
    void read();
    const refresh = () => {
      if (document.visibilityState === "visible") void read();
    };
    const timer = window.setInterval(refresh, 15000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      alive = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
      void supabase.removeChannel(channel);
    };
  }, [bookingId, active, cache]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const ageSeconds = position
    ? Math.max(0, Math.floor((now - Date.parse(position.captured_at)) / 1000))
    : null;
  return {
    position: active ? position : null,
    connection,
    ageSeconds,
    fresh: active && ageSeconds !== null && ageSeconds <= 20 && connection === "connected",
  };
}
