import { useEffect, useRef, useState } from "react";
import { Radio, RadioTower } from "lucide-react";
import { toast } from "sonner";
import { getDict, type Locale } from "@/i18n";
import { haversineEstimate } from "@/lib/trip-route";
import { pingDriverLocation, type TripStage } from "@/queries/trip-tracking";

type Coords = { lat: number; lng: number };

/**
 * Driver-side broadcaster: streams the device position to the customer's
 * live trip page while the job is active.
 */
export function ShareLocationToggle({
  bookingId,
  stage,
  target,
  locale,
}: {
  bookingId: string;
  stage: TripStage;
  target?: Coords | null;
  locale: Locale;
}) {
  const t = getDict(locale);
  const lt = t.driver.liveShare;
  const [sharing, setSharing] = useState(false);
  const watchRef = useRef<number | null>(null);
  const lastSent = useRef(0);

  useEffect(() => {
    if (!sharing) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error(lt.unsupported);
      setSharing(false);
      return;
    }

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        if (now - lastSent.current < 8000) return;
        lastSent.current = now;
        const here: Coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const rest = target ? haversineEstimate(here, target) : null;
        pingDriverLocation({
          bookingId,
          lat: here.lat,
          lng: here.lng,
          heading: pos.coords.heading ?? null,
          speedKph: pos.coords.speed != null ? Math.round(pos.coords.speed * 3.6) : null,
          etaMinutes: rest?.durationMin ?? null,
          distanceKm: rest?.distanceKm ?? null,
          stage,
        }).catch(() => toast.error(lt.failed));
      },
      () => {
        toast.error(lt.denied);
        setSharing(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );

    return () => {
      if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharing, bookingId, stage, target?.lat, target?.lng]);

  return (
    <button
      type="button"
      onClick={() => setSharing((s) => !s)}
      className={
        sharing
          ? "inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          : "inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-muted"
      }
    >
      {sharing ? <RadioTower className="h-4 w-4" /> : <Radio className="h-4 w-4" />}
      {sharing ? lt.stop : lt.start}
    </button>
  );
}
