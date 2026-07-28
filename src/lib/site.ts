// Single source of truth for absolute URLs (canonical, hreflang, sitemap, JSON-LD).
export const SITE_URL = "https://transferaround.com";

export const SITE_NAME = "TransferAround";
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
 * Default social-share image (absolute URL). Used as the fallback og:image /
 * twitter:image on every page that doesn't pass its own. TODO(phase-5): replace
 * with a dedicated, optimized 1200×630 og-default.png; logo.png (1672×941) is
 * the interim asset — a valid PNG at ~1.78:1, which social platforms accept.
 */
export const OG_DEFAULT_IMAGE = `${SITE_URL}/logo.png`;
