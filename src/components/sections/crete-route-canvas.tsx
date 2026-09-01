import { useEffect, useMemo, useRef, useState } from "react";

/** Stylised Crete coastline, hand-traced as [lng, lat] pairs (north coast W→E, south coast E→W). */
const COASTLINE: [number, number][] = [
  [23.58, 35.53],
  [23.7, 35.55],
  [23.83, 35.53],
  [23.95, 35.53],
  [24.02, 35.49],
  [24.15, 35.52],
  [24.28, 35.48],
  [24.4, 35.42],
  [24.47, 35.37],
  [24.62, 35.4],
  [24.75, 35.42],
  [24.9, 35.41],
  [25.05, 35.42],
  [25.14, 35.34],
  [25.24, 35.35],
  [25.38, 35.33],
  [25.48, 35.31],
  [25.6, 35.31],
  [25.72, 35.26],
  [25.75, 35.2],
  [25.83, 35.22],
  [26.0, 35.2],
  [26.16, 35.19],
  [26.28, 35.28],
  [26.32, 35.2],
  [26.26, 35.03],
  [26.1, 35.02],
  [25.9, 34.99],
  [25.74, 34.98],
  [25.55, 34.93],
  [25.35, 34.94],
  [25.15, 34.93],
  [24.95, 34.93],
  [24.8, 34.92],
  [24.72, 35.0],
  [24.55, 35.02],
  [24.42, 35.05],
  [24.3, 35.15],
  [24.15, 35.2],
  [24.0, 35.2],
  [23.9, 35.24],
  [23.8, 35.24],
  [23.7, 35.24],
  [23.62, 35.29],
  [23.55, 35.4],
];

const BOUNDS = { west: 23.45, east: 26.4, south: 34.8, north: 35.75 };
const VIEW = { w: 1000, h: 392 };

function project(lng: number, lat: number): [number, number] {
  const x = ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * VIEW.w;
  const y = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * VIEW.h;
  return [x, y];
}

function inBounds(lat: number, lng: number): boolean {
  return (
    lng >= BOUNDS.west - 0.3 &&
    lng <= BOUNDS.east + 0.3 &&
    lat >= BOUNDS.south - 0.3 &&
    lat <= BOUNDS.north + 0.3
  );
}

const ISLAND_PATH = `${COASTLINE.map(([lng, lat], i) => {
  const [x, y] = project(lng, lat);
  return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
}).join(" ")} Z`;

/** Anchor towns drawn as quiet reference dots. */
const TOWNS: { name: string; lng: number; lat: number }[] = [
  { name: "Chania", lng: 24.018, lat: 35.5138 },
  { name: "Rethymno", lng: 24.4741, lat: 35.3686 },
  { name: "Heraklion", lng: 25.1442, lat: 35.3387 },
  { name: "Agios Nikolaos", lng: 25.716, lat: 35.191 },
  { name: "Sitia", lng: 26.1027, lat: 35.2078 },
  { name: "Ierapetra", lng: 25.7418, lat: 35.0107 },
];

export type CanvasPoint = { lat: number; lng: number; label: string };

function arc(a: [number, number], b: [number, number]): string {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // Bow the line away from the coast for a flight-path feel.
  const lift = Math.min(90, len * 0.22);
  const cx = mx + (dy / len) * -lift;
  const cy = my + (dx / len) * lift;
  return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
}

/** Animated SVG map of Crete that draws the selected pickup → drop-off route. */
export function CreteRouteCanvas({
  pickup,
  dropoff,
  className,
}: {
  pickup?: CanvasPoint | null;
  dropoff?: CanvasPoint | null;
  className?: string;
}) {
  const from = pickup && inBounds(pickup.lat, pickup.lng) ? pickup : null;
  const to = dropoff && inBounds(dropoff.lat, dropoff.lng) ? dropoff : null;
  const a = from ? project(from.lng, from.lat) : null;
  const b = to ? project(to.lng, to.lat) : null;
  const d = useMemo(() => (a && b ? arc(a, b) : null), [a?.[0], a?.[1], b?.[0], b?.[1]]);

  const pathRef = useRef<SVGPathElement | null>(null);
  const [len, setLen] = useState(0);
  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, [d]);

  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className={className}
      role="img"
      aria-label="Crete"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="cr-island" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      <path
        d={ISLAND_PATH}
        fill="url(#cr-island)"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {TOWNS.map((town) => {
        const [x, y] = project(town.lng, town.lat);
        return (
          <g key={town.name}>
            <circle cx={x} cy={y} r="3" fill="currentColor" fillOpacity="0.35" />
            <text
              x={x + 7}
              y={y + 3.5}
              fontSize="11"
              fill="currentColor"
              fillOpacity="0.45"
              className="font-medium"
            >
              {town.name}
            </text>
          </g>
        );
      })}

      {d && (
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="var(--tfr-route-line, currentColor)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={len || 1}
          strokeDashoffset={len || 1}
          className="tfr-route-draw"
          key={d}
        />
      )}

      {a && (
        <g>
          <circle cx={a[0]} cy={a[1]} r="14" className="tfr-route-ping" />
          <circle cx={a[0]} cy={a[1]} r="6.5" fill="var(--tfr-route-pickup, currentColor)" />
          <circle cx={a[0]} cy={a[1]} r="2.5" fill="#fff" />
        </g>
      )}
      {b && (
        <g>
          <circle cx={b[0]} cy={b[1]} r="6.5" fill="var(--tfr-route-dropoff, currentColor)" />
          <circle cx={b[0]} cy={b[1]} r="2.5" fill="#fff" />
        </g>
      )}
    </svg>
  );
}
