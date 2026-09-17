// Single source of truth for absolute URLs (canonical, hreflang, sitemap, JSON-LD).
export const SITE_URL = "https://transferaround.com";

export const SITE_NAME = "TransferAround";
/** Square raster mark — Google's logo/knowledge-panel guidance wants PNG/JPG ≥112px, not SVG. */
export const LOGO_IMAGE = `${SITE_URL}/icons/icon-512.png`;
export const CONTACT_EMAIL = "hello@transferaround.com";
export const CONTACT_PHONE: string | undefined =
  import.meta.env.VITE_CONTACT_PHONE?.trim() || undefined;
export const CONTACT_PHONE_HREF: string | undefined = CONTACT_PHONE
  ? `tel:${CONTACT_PHONE.replace(/[^\d+]/g, "")}`
  : undefined;
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, "");
export const CONTACT_WHATSAPP_HREF: string | undefined = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}`
  : undefined;

/** Store and social links are rendered only after verified production URLs are configured. */
export const APP_STORE_URL: string | undefined =
  import.meta.env.VITE_APP_STORE_URL?.trim() || undefined;
export const PLAY_STORE_URL: string | undefined =
  import.meta.env.VITE_PLAY_STORE_URL?.trim() || undefined;

export const SOCIAL_FACEBOOK: string | undefined =
  import.meta.env.VITE_SOCIAL_FACEBOOK?.trim() || undefined;
export const SOCIAL_INSTAGRAM: string | undefined =
  import.meta.env.VITE_SOCIAL_INSTAGRAM?.trim() || undefined;
export const SOCIAL_X: string | undefined = import.meta.env.VITE_SOCIAL_X?.trim() || undefined;
export const REVIEWS_VERIFIED = import.meta.env.VITE_REVIEWS_VERIFIED === "true";
export const BUSINESS_METRICS_VERIFIED = import.meta.env.VITE_BUSINESS_METRICS_VERIFIED === "true";
/**
 * Named driver profiles (/drivers) carry ratings and transfer counts for real
 * people. They stay noindex, out of the sitemap and out of the footer and
 * cross-links until each published driver has consented and the figures are
 * backed by records — the same gate the reviews and business metrics use.
 */
export const DRIVER_PROFILES_VERIFIED = import.meta.env.VITE_DRIVER_PROFILES_VERIFIED === "true";

/** Branded 1200×630 card (self-hosted) used when a page has no more specific social image. */
export const OG_DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;
