import { Link } from "@tanstack/react-router";
import { Mail, Phone, Star } from "lucide-react";
import { useT } from "@/i18n";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, SITE_NAME } from "@/lib/site";
import { AVG_RATING } from "@/data/reviews";
import { Logo } from "@/components/logo";

const TOP_ROUTES = [
  { label: "Heraklion Airport → Elounda", slug: "heraklion-airport-to-elounda" },
  { label: "Heraklion Airport → Chania", slug: "heraklion-airport-to-chania" },
  { label: "Heraklion Airport → Rethymno", slug: "heraklion-airport-to-rethymno" },
  { label: "Chania Airport → Old Town", slug: "chania-airport-to-chania-old-town" },
  { label: "Chania Airport → Kissamos", slug: "chania-airport-to-kissamos" },
  { label: "Souda Port → Chania", slug: "souda-port-to-chania-old-town" },
];

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Link to="/{-$locale}" className="flex items-center">
            <Logo dark />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
            {t.footer.tagline}
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium">
            <Star className="h-3.5 w-3.5 fill-highlight text-highlight" />
            {AVG_RATING} · Google
          </div>
        </div>

        <nav aria-label={t.footer.routesTitle}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
            {t.footer.routesTitle}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {TOP_ROUTES.map((r) => (
              <li key={r.slug}>
                <Link
                  to="/{-$locale}/routes/$slug"
                  params={{ slug: r.slug }}
                  className="text-primary-foreground/80 transition hover:text-accent"
                >
                  {r.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/{-$locale}/routes"
                className="font-medium text-accent transition hover:opacity-80"
              >
                {t.nav.allRoutes} →
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={t.footer.companyTitle}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
            {t.footer.companyTitle}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link
                to="/{-$locale}/about"
                className="text-primary-foreground/80 transition hover:text-accent"
              >
                {t.nav.about}
              </Link>
            </li>
            <li>
              <Link
                to="/{-$locale}/how-it-works"
                className="text-primary-foreground/80 transition hover:text-accent"
              >
                {t.nav.howItWorks}
              </Link>
            </li>
            <li>
              <Link
                to="/{-$locale}/reviews"
                className="text-primary-foreground/80 transition hover:text-accent"
              >
                {t.nav.reviews}
              </Link>
            </li>
            <li>
              <Link
                to="/{-$locale}/faq"
                className="text-primary-foreground/80 transition hover:text-accent"
              >
                {t.nav.faq}
              </Link>
            </li>
            <li>
              <Link
                to="/{-$locale}/blog"
                className="text-primary-foreground/80 transition hover:text-accent"
              >
                {t.nav.blog}
              </Link>
            </li>
            <li>
              <Link
                to="/{-$locale}/for-hotels"
                className="text-primary-foreground/80 transition hover:text-accent"
              >
                {t.nav.forHotels}
              </Link>
            </li>
            <li>
              <Link
                to="/{-$locale}/for-drivers"
                className="text-primary-foreground/80 transition hover:text-accent"
              >
                {t.nav.forDrivers}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={t.footer.servicesTitle}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
            {t.footer.servicesTitle}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {(
              [
                { label: "Airport transfers", slug: "airport-transfers" },
                { label: "Port transfers", slug: "port-transfers" },
                { label: "Hotel transfers", slug: "hotel-transfers" },
                { label: "Private day tours", slug: "private-tours" },
                { label: "Long distance", slug: "long-distance" },
                { label: "Group transfers", slug: "group-transfers" },
              ] as const
            ).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/{-$locale}/services/$slug"
                  params={{ slug: s.slug }}
                  className="text-primary-foreground/80 transition hover:text-accent"
                >
                  {s.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/{-$locale}/fleet"
                className="text-primary-foreground/80 transition hover:text-accent"
              >
                {t.nav.fleet}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
            {t.footer.contactTitle}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 text-primary-foreground/80 transition hover:text-accent"
              >
                <Mail className="h-4 w-4" />
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={CONTACT_PHONE_HREF}
                className="inline-flex items-center gap-2 text-primary-foreground/80 transition hover:text-accent"
              >
                <Phone className="h-4 w-4" />
                {CONTACT_PHONE}
              </a>
            </li>
            <li className="text-primary-foreground/60">{t.footer.dispatch}</li>
            <li className="text-primary-foreground/60">{t.footer.office}</li>
          </ul>
          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
            {t.footer.legalTitle}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link
                to="/{-$locale}/legal/terms"
                className="text-primary-foreground/80 transition hover:text-accent"
              >
                {t.footer.terms}
              </Link>
            </li>
            <li>
              <Link
                to="/{-$locale}/legal/privacy"
                className="text-primary-foreground/80 transition hover:text-accent"
              >
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link
                to="/{-$locale}/legal/cookies"
                className="text-primary-foreground/80 transition hover:text-accent"
              >
                {t.footer.cookies}
              </Link>
            </li>
            <li>
              <Link
                to="/{-$locale}/legal/refunds"
                className="text-primary-foreground/80 transition hover:text-accent"
              >
                {t.footer.refunds}
              </Link>
            </li>
            <li>
              <Link
                to="/{-$locale}/legal/imprint"
                className="text-primary-foreground/80 transition hover:text-accent"
              >
                {t.footer.imprint}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-5 text-xs text-primary-foreground/60">
          <span>
            © {new Date().getFullYear()} {SITE_NAME}. {t.footer.rights}
          </span>
          <span>Heraklion · Chania · Rethymno · Lasithi</span>
        </div>
      </div>
    </footer>
  );
}
