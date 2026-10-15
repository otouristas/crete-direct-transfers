import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatEur } from "@/lib/pricing";
import { nextDriverAction, journeyPhase } from "../../../packages/mobile-shared/src/trip-state";
import { tripCopy } from "@/lib/trip-copy";
import { useLocale } from "@/i18n";
import { BookingRouteMap, type MapEndpoint } from "@/components/booking/booking-route-map";
import { fetchTripRoute, type TripRouteResult } from "@/lib/trip-route";
import type { Database, Json } from "@/integrations/supabase/types";

type TestRide = Database["public"]["Tables"]["test_rides"]["Row"];
function point(value: Json, kind: "pickup" | "dropoff", label: string): MapEndpoint | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return typeof value.lat === "number" && typeof value.lng === "number"
    ? { lat: value.lat, lng: value.lng, kind, label }
    : null;
}

/** The same isolated test rides used by Swift. Test controls never touch paid jobs. */
export function TestTransfers({ driver = false }: { driver?: boolean }) {
  const { user } = useAuth();
  const locale = useLocale();
  const copy = tripCopy(locale, driver);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());
  const membership = useQuery({
    queryKey: ["transfer-testing", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("is_transfer_tester");
      if (error) throw error;
      return !!data;
    },
  });
  const data = useQuery({
    queryKey: ["test-transfers", user?.id, driver],
    enabled: membership.data === true,
    refetchInterval: 5000,
    queryFn: async () => {
      const [rides, offers, availability] = await Promise.all([
        supabase
          .from("test_rides")
          .select("*")
          .eq(driver ? "driver_id" : "user_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(5),
        driver ? supabase.rpc("my_test_ride_offers") : Promise.resolve({ data: [], error: null }),
        driver
          ? supabase.rpc("get_test_driver_availability")
          : Promise.resolve({ data: null, error: null }),
      ]);
      if (rides.error || offers.error || availability.error)
        throw rides.error || offers.error || availability.error;
      return {
        rides: rides.data ?? [],
        offers: offers.data ?? [],
        online: !!availability.data && Date.parse(availability.data) > Date.now(),
      };
    },
  });
  useEffect(() => {
    if (!membership.data || !user) return;
    const channel = supabase
      .channel(`web-native-tests:${user.id}:${driver}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "test_rides" }, () => {
        void queryClient.invalidateQueries({ queryKey: ["test-transfers", user.id] });
      })
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "test_ride_offers",
          filter: `driver_id=eq.${user.id}`,
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["test-transfers", user.id] });
        },
      )
      .subscribe();
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearInterval(timer);
      void supabase.removeChannel(channel);
    };
  }, [membership.data, user, driver, queryClient]);
  if (!membership.data) return null;
  async function run(operation: () => PromiseLike<{ error: unknown }>) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const { error } = await operation();
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["test-transfers", user?.id] });
    } catch (e) {
      setError(
        e && typeof e === "object" && "message" in e
          ? String(e.message)
          : "Couldn’t update this test transfer. Refresh and try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="mb-7 rounded-3xl border border-[#245BEB]/20 bg-[#F7F9FF] p-5 text-left md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#245BEB]">
            Test transfers · No charge
          </p>
          <h2 className="mt-2 font-display text-xl font-bold">Connected to your iOS apps</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Demo payment, driver offers and live trip stages use the same test database. Paid
            bookings stay separate.
          </p>
        </div>
        {driver && (
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void run(() =>
                supabase.rpc("set_test_driver_online", { p_online: !data.data?.online }),
              )
            }
            className="rounded-xl bg-[#245BEB] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {data.data?.online ? "Go offline for tests" : "Go online for tests"}
          </button>
        )}
      </div>
      {(error || data.error) && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {error || "Couldn’t refresh test transfers."}
        </p>
      )}
      {data.data?.offers
        .filter((offer) => Date.parse(offer.expires_at) > now)
        .map((offer) => (
          <div key={offer.offer_id} className="mt-5 rounded-2xl bg-white p-5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>New test offer</span>
              <span>
                {Math.max(0, Math.ceil((Date.parse(offer.expires_at) - now) / 1000))}s left
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold">
              {offer.pickup_address} → {offer.dropoff_address}
            </p>
            <p className="mt-2 text-sm">
              {offer.passengers} travelers · {formatEur(offer.price_cents / 100)}
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  void run(() =>
                    supabase.rpc("respond_to_test_ride", {
                      p_offer_id: offer.offer_id,
                      p_accept: true,
                    }),
                  )
                }
                className="rounded-xl bg-[#101114] px-5 py-3 text-sm font-semibold text-white"
              >
                Accept test ride
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  void run(() =>
                    supabase.rpc("respond_to_test_ride", {
                      p_offer_id: offer.offer_id,
                      p_accept: false,
                    }),
                  )
                }
                className="rounded-xl border px-4 py-3 text-sm"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      {data.data?.rides.map((ride) => {
        const action = nextDriverAction(ride);
        const closed = ["completed", "cancelled", "expired"].includes(ride.status);
        return (
          <div key={ride.id} className="mt-5 overflow-hidden rounded-2xl bg-white">
            <div className="space-y-3 p-5">
              <div className="flex flex-wrap justify-between gap-2 text-sm font-semibold">
                <span>
                  {ride.status === "expired"
                    ? "No driver accepted"
                    : copy.phases[journeyPhase({ ...ride, payment_status: "paid" })]}
                </span>
                <span>{formatEur(ride.price_cents / 100)}</span>
              </div>
              <p className="text-sm">
                {ride.pickup_address} → {ride.dropoff_address}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(ride.pickup_at).toLocaleString(locale)} · {ride.passengers} travelers ·{" "}
                {ride.vehicle_class} · {ride.bags_checked} large bags
                {ride.flight_number ? ` · Flight ${ride.flight_number}` : ""}
              </p>
              {!closed && (
                <div className="flex flex-wrap gap-3">
                  {driver && action && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void run(() =>
                          supabase.rpc("advance_test_ride", {
                            p_ride_id: ride.id,
                            p_action: action,
                          }),
                        )
                      }
                      className="rounded-xl bg-[#245BEB] px-4 py-3 text-sm font-semibold text-white"
                    >
                      {action === "start"
                        ? "Start driving"
                        : action === "arrive"
                          ? "I’m at the pickup"
                          : action === "board"
                            ? "Traveler on board"
                            : "Complete test transfer"}
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      void run(() => supabase.rpc("cancel_test_ride", { p_ride_id: ride.id }))
                    }
                    className="rounded-xl border px-4 py-3 text-sm"
                  >
                    Cancel test
                  </button>
                </div>
              )}
            </div>
            {!closed && <TestRideMap ride={ride} />}
          </div>
        );
      })}
      {data.data && !data.data.rides.length && !data.data.offers.length && (
        <p className="mt-5 text-sm text-muted-foreground">
          {driver
            ? "Go online here or in Driver, then create a test transfer in the Traveler app."
            : "Create a transfer in the Traveler app and enable “Test this transfer” before demo payment. It will appear here."}
        </p>
      )}
    </section>
  );
}
function TestRideMap({ ride }: { ride: TestRide }) {
  const [route, setRoute] = useState<TripRouteResult | null>(null);
  const pickup = useMemo(
    () => point(ride.pickup_point, "pickup", ride.pickup_address),
    [ride.pickup_point, ride.pickup_address],
  );
  const dropoff = useMemo(
    () => point(ride.dropoff_point, "dropoff", ride.dropoff_address),
    [ride.dropoff_point, ride.dropoff_address],
  );
  const location = useQuery({
    queryKey: ["test-position", ride.id],
    refetchInterval: 5000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("test_trip_locations")
        .select("*")
        .eq("booking_id", ride.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const refetchLocation = location.refetch;
  useEffect(() => {
    let alive = true;
    if (pickup && dropoff)
      void fetchTripRoute(pickup, dropoff).then((r) => {
        if (alive) setRoute(r);
      });
    return () => {
      alive = false;
    };
  }, [pickup, dropoff]);
  useEffect(() => {
    const channel = supabase
      .channel(`test-gps:${ride.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "test_trip_locations",
          filter: `booking_id=eq.${ride.id}`,
        },
        () => {
          void refetchLocation();
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [ride.id, refetchLocation]);
  const p = location.data;
  const fresh = !!p && Date.now() - Date.parse(p.captured_at) < 20000;
  return (
    <>
      <p className="px-5 pb-3 text-xs text-muted-foreground">
        {p
          ? fresh
            ? "Live driver location"
            : "Last location · waiting for a fresh update"
          : "Waiting for driver GPS from the Driver app"}
        {route ? ` · ${route.distanceKm.toFixed(1)} km · ~${Math.ceil(route.durationMin)} min` : ""}
      </p>
      <BookingRouteMap
        pickup={pickup}
        dropoff={dropoff}
        geometry={route?.geometry}
        driver={p ? { lat: p.latitude, lng: p.longitude, heading: p.heading, fresh } : null}
        className="h-64 rounded-none"
      />
    </>
  );
}
