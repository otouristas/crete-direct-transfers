/**
 * Responsive sources for the fleet studio shots in public/fleet.
 *
 * The originals are 1536×1024 — right for the class-page hero, but 5–25× more
 * pixels than the cards and the booking-list thumbnails need. The 400w and 800w
 * variants next to them (generated with `sips -Z`) let the browser pick, which
 * takes the eight-thumbnail booking list from ~1.5 MB down to ~160 KB.
 */

/** Intrinsic size of every fleet original — set on <img> to reserve layout space. */
export const FLEET_IMAGE_WIDTH = 1536;
export const FLEET_IMAGE_HEIGHT = 1024;

/** `srcSet` for a `/fleet/<name>.jpg` path. Returns "" for anything else. */
export function fleetSrcSet(image: string): string {
  const name = image.startsWith("/fleet/") ? image.slice("/fleet/".length) : "";
  if (!name || name.includes("/")) return "";
  return `/fleet/400/${name} 400w, /fleet/800/${name} 800w, ${image} ${FLEET_IMAGE_WIDTH}w`;
}
