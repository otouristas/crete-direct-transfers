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
          <stop offset="0%" stopColor="oklch(0.968 0.007 247.9)" />
          <stop offset="100%" stopColor="oklch(0.885 0.06 190 / 0.35)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="220" fill="url(#sea)" />
      <path
        d="M20 130 Q60 90 110 100 T210 95 Q260 90 310 105 T380 120 Q370 155 320 155 T220 158 Q170 162 120 155 T30 150 Z"
        fill="oklch(0.984 0.003 247.86)"
        stroke="oklch(0.28 0.07 262)"
        strokeWidth="1.2"
      />
      {/* Animated route lines connecting hubs */}
      <path
        className="route-line"
        d="M65 128 Q100 108 145 122 Q190 138 235 128 Q285 118 330 128"
        fill="none"
        stroke="oklch(0.511 0.096 186.4)"
        strokeWidth="1.5"
        strokeDasharray="4 5"
      />
      {REGIONS.map((r) => {
        const pos = positions[r.slug];
        const count = ROUTES.filter((route) => route.region === r.name).length;
        return (
          <Link key={r.slug} to="/{-$locale}/regions/$slug" params={{ slug: r.slug }}>
            <g className="cursor-pointer">
              <circle cx={pos.x} cy={pos.y} r="9" fill="oklch(0.704 0.14 182.5 / 0.18)" />
              <circle cx={pos.x} cy={pos.y} r="4" fill="oklch(0.511 0.096 186.4)" />
              <text
                x={pos.x}
                y={pos.y - 14}
                textAnchor="middle"
                fontSize="11"
                fontFamily="Inter"
                fontWeight="500"
                fill="oklch(0.28 0.07 262)"
              >
                {r.name}
              </text>
              <text
                x={pos.x}
                y={pos.y + 22}
                textAnchor="middle"
                fontSize="8"
                fontFamily="Inter"
                fill="oklch(0.554 0.046 257.4)"
              >
                {count} routes
              </text>
            </g>
          </Link>
        );
      })}
    </svg>
  );
}
