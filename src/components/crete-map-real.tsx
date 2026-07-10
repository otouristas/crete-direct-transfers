import { lazy, Suspense, useEffect, useState } from "react";

// Leaflet touches `window` at import time — load it lazily and only after mount
// so SSR renders a lightweight placeholder.
const CreteMapInner = lazy(() => import("./crete-map-inner"));

function MapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-muted">
      <span className="text-sm text-muted-foreground">…</span>
    </div>
  );
}

export function CreteMapReal() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <MapSkeleton />;
  return (
    <Suspense fallback={<MapSkeleton />}>
      <CreteMapInner />
    </Suspense>
  );
}
