import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useLocale, useT } from "@/i18n";
import { getLocalizedRoutes, getLocalizedServices } from "@/i18n/content";
import {
  APP_STORE_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  CONTACT_WHATSAPP_HREF,
  PLAY_STORE_URL,
  SITE_NAME,
  SOCIAL_FACEBOOK,
  SOCIAL_INSTAGRAM,
  SOCIAL_X,
  REVIEWS_VERIFIED,
} from "@/lib/site";
import { AVG_RATING } from "@/data/reviews";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getMarketNavigation } from "@/lib/market-navigation";

const TOP_ROUTE_SLUGS = new Set([
  "heraklion-airport-to-elounda",
  "heraklion-airport-to-chania",
  "heraklion-airport-to-rethymno",
  "chania-airport-to-chania-old-town",
  "chania-airport-to-kissamos",
  "souda-port-to-chania-old-town",
]);

const PAYMENT_LOGOS = [
  { src: "/footer/visa.svg", alt: "Visa", className: "h-6 w-auto lg:h-7" },
  { src: "/footer/mastercard.svg", alt: "Mastercard", className: "h-6 w-auto lg:h-7" },
  { src: "/footer/amex.svg", alt: "American Express", className: "h-6 w-auto lg:h-7" },
  { src: "/footer/paypal.svg", alt: "PayPal", className: "h-6 w-auto lg:h-7" },
  { src: "/footer/apple-pay.svg", alt: "Apple Pay", className: "h-6 w-auto lg:h-7" },
  { src: "/footer/google-pay.svg", alt: "Google Pay", className: "h-6 w-auto lg:h-7" },
  { src: "/footer/jcb.svg", alt: "JCB", className: "h-5 w-auto lg:h-6" },
] as const;

function OptionalLink({
  href,
  title,
  className,
  children,
}: {
  href: string | undefined;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  if (href) {
    return (
      <a href={href} title={title} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return null;
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
    </svg>
  );
}

const linkClass = "text-primary-foreground/80 transition hover:text-accent hover:underline";

export function SiteFooter() {
  const t = useT();
  const locale = useLocale();
  const year = new Date().getFullYear();
  const topRoutes = getLocalizedRoutes(locale).filter((route) => TOP_ROUTE_SLUGS.has(route.slug));
  const services = getLocalizedServices(locale);
  const markets = getMarketNavigation(locale);
  const hasSocial = Boolean(SOCIAL_FACEBOOK || SOCIAL_INSTAGRAM || SOCIAL_X);

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Top: logo + language */}
      <div className="mx-auto max-w-7xl px-6 pt-16 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-y-4 md:grid-cols-2">
          <div className="flex items-center">
            <Link to="/{-$locale}" className="flex items-center">
              <Logo dark />
            </Link>
          </div>
          <div className="flex items-center justify-start md:justify-end">
            <LanguageSwitcher
              onDark
              className="text-primary-foreground hover:bg-primary-foreground/10"
            />
          </div>
        </div>

        {/* Social icons */}
        {hasSocial && (
          <div className="mt-10 flex gap-x-6" aria-label={t.footer.socialAria}>
            <OptionalLink
              href={SOCIAL_FACEBOOK}
              title={t.footer.facebook}
              className="text-primary-foreground transition hover:text-primary-foreground/70"
            >
              <span className="sr-only">{t.footer.facebook}</span>
              <FacebookIcon className="size-6" />
            </OptionalLink>
            <OptionalLink
              href={SOCIAL_INSTAGRAM}
              title={t.footer.instagram}
              className="text-primary-foreground transition hover:text-primary-foreground/70"
            >
              <span className="sr-only">{t.footer.instagram}</span>
              <InstagramIcon className="size-6" />
            </OptionalLink>
            <OptionalLink
              href={SOCIAL_X}
              title={t.footer.x}
              className="text-primary-foreground transition hover:text-primary-foreground/70"
            >
              <span className="sr-only">{t.footer.x}</span>
              <XIcon className="size-6" />
            </OptionalLink>
          </div>
        )}
      </div>

      {/* Columns */}
      <div className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-12 px-6 pb-4 md:grid-cols-2 lg:grid-cols-5 lg:gap-10 lg:px-10">
        {/* Support */}
        <div>
          <p className="text-lg font-semibold">{t.footer.supportTitle}</p>
          <div className="mt-5 space-y-4 text-sm">
            {CONTACT_PHONE && CONTACT_PHONE_HREF && (
              <div>
                <p className="font-light text-primary-foreground/50">{t.footer.dispatch}</p>
                <a href={CONTACT_PHONE_HREF} className={`mt-1 block ${linkClass}`}>
                  {CONTACT_PHONE}
                </a>
              </div>
            )}
            {CONTACT_PHONE && CONTACT_WHATSAPP_HREF && (
              <div>
                <p className="font-light text-primary-foreground/50">{t.footer.whatsappSupport}</p>
                <a
                  href={CONTACT_WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-1 block ${linkClass}`}
                >
                  {CONTACT_PHONE}
                </a>
              </div>
            )}
            <div>
              <p className="font-light text-primary-foreground/50">{t.footer.generalInquiries}</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className={`mt-1 block ${linkClass}`}>
                {CONTACT_EMAIL}
              </a>
            </div>
            <p className="text-primary-foreground/50">{t.footer.office}</p>
          </div>
        </div>

        {/* Top routes */}
        <nav aria-label={t.footer.routesTitle}>
          <h3 className="text-lg font-semibold">{t.footer.routesTitle}</h3>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed">
            {topRoutes.map((r) => (
              <li key={r.slug}>
                <Link to="/{-$locale}/routes/$slug" params={{ slug: r.slug }} className={linkClass}>
                  {r.from} → {r.to}
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

        {/* Destinations */}
        <nav aria-label={t.nav.destinations}>
          <h3 className="text-lg font-semibold">{t.nav.destinations}</h3>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed">
            {markets.map((market) => (
              <li key={market.slug}>
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={`/{-$locale}/${market.slug}` as any}
                  className={linkClass}
                >
                  <span aria-hidden>{market.flag}</span> {market.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/{-$locale}/countries"
                className="font-medium text-accent transition hover:opacity-80"
              >
                {t.nav.allDestinations} →
              </Link>
            </li>
          </ul>
        </nav>

        {/* Services */}
        <nav aria-label={t.footer.servicesTitle}>
          <h3 className="text-lg font-semibold">{t.footer.servicesTitle}</h3>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  to="/{-$locale}/services/$slug"
                  params={{ slug: s.slug }}
                  className={linkClass}
                >
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/{-$locale}/fleet" className={linkClass}>
                {t.nav.fleet}
              </Link>
            </li>
            <li>
              <Link to="/{-$locale}/for-hotels" className={linkClass}>
                {t.nav.forHotels}
              </Link>
            </li>
            <li>
              <Link to="/{-$locale}/for-drivers" className={linkClass}>
                {t.nav.forDrivers}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Company */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">{t.footer.companyTitle}</h3>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li>
              <Link to="/{-$locale}/about" className={linkClass}>
                {t.nav.about}
              </Link>
            </li>
            <li>
              <Link to="/{-$locale}/how-it-works" className={linkClass}>
                {t.nav.howItWorks}
              </Link>
            </li>
            {REVIEWS_VERIFIED && (
              <li>
                <Link to="/{-$locale}/reviews" className={linkClass}>
                  {t.nav.reviews}
                </Link>
              </li>
            )}
            <li>
              <Link to="/{-$locale}/faq" className={linkClass}>
                {t.nav.faq}
              </Link>
            </li>
            <li>
              <Link to="/{-$locale}/touristas-ai" className={linkClass}>
                {t.touristasAi.title}
              </Link>
            </li>
            <li>
              <Link to="/{-$locale}/blog" className={linkClass}>
                {t.nav.blog}
              </Link>
            </li>
            <li>
              <Link to="/{-$locale}/contact" className={linkClass}>
                {t.nav.contact}
              </Link>
            </li>
            <li>
              <Link to="/{-$locale}/legal/terms" className={linkClass}>
                {t.footer.terms}
              </Link>
            </li>
            <li>
              <Link to="/{-$locale}/legal/privacy" className={linkClass}>
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link to="/{-$locale}/legal/cookies" className={linkClass}>
                {t.footer.cookies}
              </Link>
            </li>
            <li>
              <Link to="/{-$locale}/legal/refunds" className={linkClass}>
                {t.footer.refunds}
              </Link>
            </li>
            <li>
              <Link to="/{-$locale}/legal/imprint" className={linkClass}>
                {t.footer.imprint}
              </Link>
            </li>
            <li>
              <Link to="/{-$locale}/legal/driver-partnership" className={linkClass}>
                {t.footer.driverPartnership}
              </Link>
            </li>
            <li>
              <Link to="/{-$locale}/legal/kyc" className={linkClass}>
                {t.footer.kyc}
              </Link>
            </li>
          </ul>
          {REVIEWS_VERIFIED && (
            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium">
              <Star className="h-3.5 w-3.5 fill-highlight text-highlight" />
              {AVG_RATING} · Google
            </div>
          )}
        </div>
      </div>

      {/* Bottom: apps + copyright + payments */}
      <div className="mx-auto max-w-7xl border-t border-primary-foreground/10 px-6 pb-10 pt-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-3">
          <OptionalLink href={APP_STORE_URL} title={t.footer.downloadAppStore}>
            <img
              src="/footer/apple-store.svg"
              alt={t.footer.downloadAppStore}
              className="h-10 w-[145px] object-contain"
              width={145}
              height={40}
              loading="lazy"
              decoding="async"
            />
          </OptionalLink>
          <OptionalLink href={PLAY_STORE_URL} title={t.footer.downloadPlayStore}>
            <img
              src="/footer/google-play.svg"
              alt={t.footer.downloadPlayStore}
              className="h-10 w-[145px] object-contain"
              width={145}
              height={40}
              loading="lazy"
              decoding="async"
            />
          </OptionalLink>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 text-sm text-primary-foreground/70 lg:grid-cols-2">
          <div>
            <p>
              {year} © {SITE_NAME} | {t.footer.rights}
            </p>
            <p className="mt-1 text-primary-foreground/50">{t.footer.regions}</p>
          </div>
          <div
            className="flex flex-wrap items-center justify-start gap-3 lg:justify-end"
            role="group"
            aria-label={t.footer.paymentsAria}
          >
            {PAYMENT_LOGOS.map((logo) => (
              <img
                key={logo.src}
                src={logo.src}
                alt={logo.alt}
                className={`${logo.className} opacity-90 brightness-0 invert`}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
