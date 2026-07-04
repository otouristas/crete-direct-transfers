import { REGIONS } from "@/data/regions";
import { ROUTES } from "@/data/routes";
import { Link } from "@tanstack/react-router";

export function CreteMap() {
  const positions: Record<string, { x: number; y: number }> = {
    chania: { x: 65, y: 128 },
    rethymno: { x: 145, y: 122 },
    heraklion: { x: 235, y: 128 },
    lasithi: { x: 330, y: 128 },
  };
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full">
      <defs>
        <linearGradient id="sea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.95 0.015 85)" />
          <stop offset="100%" stopColor="oklch(0.93 0.02 220 / 0.4)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="220" fill="url(#sea)" />
      <path
        d="M20 130 Q60 90 110 100 T210 95 Q260 90 310 105 T380 120 Q370 155 320 155 T220 158 Q170 162 120 155 T30 150 Z"
        fill="oklch(0.97 0.008 85)"
        stroke="oklch(0.32 0.05 235)"
        strokeWidth="1.2"
      />
      {/* Animated route lines connecting hubs */}
      <path
        className="route-line"
        d="M65 128 Q100 108 145 122 Q190 138 235 128 Q285 118 330 128"
        fill="none"
        stroke="oklch(0.58 0.14 42)"
        strokeWidth="1.5"
        strokeDasharray="4 5"
      />
      {REGIONS.map((r) => {
        const pos = positions[r.slug];
        const count = ROUTES.filter((route) => route.region === r.name).length;
        return (
          <Link key={r.slug} to="/regions/$slug" params={{ slug: r.slug }}>
            <g className="cursor-pointer">
              <circle cx={pos.x} cy={pos.y} r="9" fill="oklch(0.58 0.14 42 / 0.15)" />
              <circle cx={pos.x} cy={pos.y} r="4" fill="oklch(0.58 0.14 42)" />
              <text x={pos.x} y={pos.y - 14} textAnchor="middle" fontSize="11" fontFamily="Inter" fontWeight="500" fill="oklch(0.32 0.05 235)">
                {r.name}
              </text>
              <text x={pos.x} y={pos.y + 22} textAnchor="middle" fontSize="8" fontFamily="Inter" fill="oklch(0.45 0.02 240)">
                {count} routes
              </text>
            </g>
          </Link>
        );
      })}
    </svg>
  );
}
