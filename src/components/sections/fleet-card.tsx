import { Link } from "@tanstack/react-router";
import { Users, Briefcase } from "lucide-react";
import type { VEHICLE_CLASSES } from "@/data/routes";

export function FleetCard({ vehicle }: { vehicle: (typeof VEHICLE_CLASSES)[number] }) {
  return (
    <Link
      to="/{-$locale}/fleet/$class"
      params={{ class: vehicle.id }}
      className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-xl"
    >
      <div className="h-36 overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.example}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-display text-primary">{vehicle.label}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{vehicle.description}</p>
        <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-accent-deep" />
            {vehicle.capacity}
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5 text-accent-deep" />
            {vehicle.bags}
          </span>
        </div>
      </div>
    </Link>
  );
}
