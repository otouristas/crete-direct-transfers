import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { VEHICLE_CLASSES, ROUTES, type VehicleClass } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";
import { Check } from "lucide-react";

const VALID: VehicleClass[] = ["economy", "comfort", "minivan", "luxury"];

export const Route = createFileRoute("/fleet/$class")({
  loader: ({ params }) => {
    if (!VALID.includes(params.class as VehicleClass)) throw notFound();
    const vc = VEHICLE_CLASSES.find((v) => v.id === (params.class as VehicleClass))!;
    return { vc };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Not found | CreteTransfers" }, { name: "robots", content: "noindex" }] };
    const v = loaderData.vc;
    const title = `${v.label} Class | Crete Transfer Vehicle · CreteTransfers`;
    const desc = `${v.description} ${v.capacity}, ${v.bags}. Fixed-price ${v.label.toLowerCase()} transfers across Crete.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: v.image },
        { property: "og:url", content: `/fleet/${params.class}` },
      ],
      links: [{ rel: "canonical", href: `/fleet/${params.class}` }],
    };
  },
  component: FleetDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-serif text-3xl text-primary">Vehicle class not found</h1>
      <Link to="/fleet" className="inline-flex mt-6 rounded-full bg-accent px-5 py-2 text-sm text-accent-foreground">All classes</Link>
    </div>
  ),
});

function FleetDetail() {
  const { vc } = Route.useLoaderData();
  const others = VEHICLE_CLASSES.filter((v) => v.id !== vc.id);
  const popular = ROUTES.slice(0, 6);
  return (
    <>
      <section className="relative">
        <div className="aspect-[16/7] bg-cover bg-center" style={{ backgroundImage: `url(${vc.image})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-10 md:pb-14 text-primary-foreground">
          <nav className="flex gap-2 text-xs text-primary-foreground/70 mb-3">
            <Link to="/" className="hover:text-accent">Home</Link><span>/</span>
            <Link to="/fleet" className="hover:text-accent">Fleet</Link><span>/</span>
            <span>{vc.label}</span>
          </nav>
          <div className="text-xs uppercase tracking-[0.2em] text-accent">{vc.example}</div>
          <h1 className="mt-2 text-4xl md:text-6xl font-serif">{vc.label} class</h1>
          <p className="mt-3 text-lg text-primary-foreground/85">{vc.capacity} · {vc.bags}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-lg text-foreground/90 leading-relaxed max-w-2xl">{vc.description}</p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-card border border-border/60 p-6">
              <h3 className="font-serif text-lg text-primary">Specifications</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex justify-between"><span className="text-muted-foreground">Capacity</span><span>{vc.capacity}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Luggage</span><span>{vc.bags}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Example</span><span>{vc.example}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Max age</span><span>7 years</span></li>
              </ul>
            </div>
            <div className="rounded-2xl bg-card border border-border/60 p-6">
              <h3 className="font-serif text-lg text-primary">All classes include</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {["Air conditioning", "Bottled water", "Free flight tracking", "Free waiting 60 min", "Licensed local driver", "Named driver + WhatsApp"].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-serif text-2xl text-primary">Prices on popular routes</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {popular.map((r) => {
                const q = quote({ routeSlug: r.slug, vehicleClass: vc.id });
                return (
                  <Link
                    key={r.slug}
                    to="/routes/$slug"
                    params={{ slug: r.slug }}
                    className="rounded-xl bg-card border border-border/60 p-4 hover:border-accent flex justify-between items-center transition"
                  >
                    <span className="text-sm font-medium text-foreground">{r.from} → {r.to}</span>
                    <span className="text-sm text-accent">{q ? formatEur(q.totalEur) : "—"}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit rounded-2xl bg-primary text-primary-foreground p-6">
          <div className="text-xs uppercase tracking-widest text-accent">Book {vc.label}</div>
          <Link
            to="/book"
            search={{ class: vc.id }}
            className="mt-5 block text-center rounded-full bg-accent px-5 py-3 text-accent-foreground text-sm hover:opacity-90"
          >
            Get a fixed price
          </Link>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="font-serif text-2xl text-primary mb-6">Other vehicle classes</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {others.map((v) => (
            <Link key={v.id} to="/fleet/$class" params={{ class: v.id }} className="rounded-xl bg-card border border-border/60 p-5 hover:border-accent transition">
              <div className="font-serif text-primary text-lg">{v.label}</div>
              <div className="text-sm text-muted-foreground mt-1">{v.capacity} · {v.bags}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
