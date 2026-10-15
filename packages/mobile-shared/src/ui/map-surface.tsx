import { LeafletMap } from "./leaflet-map";
import type { MapSurfaceProps } from "./map-surface-types";
/** Browser fallback. Native builds resolve map-surface.native.tsx and use Apple MapKit. */
export function MapSurface(props: MapSurfaceProps) {
  const points = [...props.points];
  if (props.driverPoint) points.push({ ...props.driverPoint, label: "Driver’s last position" });
  if (!points.length && props.userPoint)
    points.push({ ...props.userPoint, label: "Your position" });
  return <LeafletMap {...props} points={points} />;
}
