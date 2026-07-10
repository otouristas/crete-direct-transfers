import { lazy, Suspense, useEffect, useState } from "react";

export type PickedLocation = { lat: number; lng: number };

const LocationPickerInner = lazy(() => import("./location-picker-inner"));

function PickerSkeleton() {
  return <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />;
}

/** Client-only Leaflet pin picker. Calls onPick with coords + reverse-geocoded address. */
export function LocationPicker({
  value,
  onPick,
}: {
  value?: PickedLocation | null;
  onPick: (point: PickedLocation, address: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <PickerSkeleton />;
  return (
    <Suspense fallback={<PickerSkeleton />}>
      <LocationPickerInner value={value} onPick={onPick} />
    </Suspense>
  );
}
