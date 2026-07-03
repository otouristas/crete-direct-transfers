import { createFileRoute, Link } from "@tanstack/react-router";
import { VEHICLE_CLASSES, ROUTES } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Our Fleet | Vehicles & Classes | CreteTransfers" },
      {
        name: "description",
        content:
          "Economy, Comfort, Minivan and Luxury classes for Crete transfers. All vehicles under seven years old, all locally owned.",
      },
      { property: "og:title", content: "Our Fleet | CreteTransfers" },
      { property: "og:description", content: "Four vehicle classes for Crete transfers." },
      { property: "og:url", content: "/fleet" },
    ],
    links: [{ rel: "canonical", href: "/fleet" }],
  }),
  component: FleetPage,
});

function FleetPage() {
  return (
    <>
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">The fleet</div>
          <h1 className="mt-3 text-4xl md:text-5xl font-serif text-primary max-w-2xl">
            Four classes. All under seven years old.
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl">
            Every vehicle in our fleet is owned by a licensed Cretan driver we've met in person. No
            random matches. No mystery car at the arrivals gate.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 space-y-12">
        {VEHICLE_CLASSES.map((v, i) => {
          const q = quote({ routeSlug: ROUTES[0].slug, vehicleClass: v.id });
          return (
            <div
              key={v.id}
              className={`grid md:grid-cols-2 gap-10 items-center ${
                i % 2 === 1 ? "md:[direction:rtl]" : ""
              }`}
            >
              <div
                className="aspect-[4/3] rounded-2xl bg-cover bg-center border border-border/60"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-${
                    ["1549399542-7e3f8b79c341", "1553440569-bcc63803a83d", "1550355291-bbee04a92027", "1563720223185-11003d516935"][i]
                  }?auto=format&fit=crop&w=1200&q=70)`,
                }}
              />
              <div className="[direction:ltr]">
                <div className="text-xs uppercase tracking-widest text-accent">Class {String(i + 1).padStart(2, "0")}</div>
                <h2 className="mt-2 font-serif text-3xl text-primary">{v.label}</h2>
                <div className="mt-2 text-sm text-muted-foreground">
                  {v.example} · {v.capacity} · {v.bags}
                </div>
                <p className="mt-4 text-foreground/90">{v.description}</p>
                <div className="mt-6 flex items-baseline gap-4">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    from
                  </span>
                  <span className="font-serif text-3xl text-accent">
                    {q ? formatEur(q.totalEur) : "—"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    (Heraklion Airport → Elounda)
                  </span>
                </div>
                <Link
                  to="/book"
                  search={{ class: v.id }}
                  className="inline-flex mt-6 rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm hover:opacity-90"
                >
                  Book a {v.label} transfer
                </Link>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
