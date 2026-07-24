// Single source of truth for absolute URLs (canonical, hreflang, sitemap, JSON-LD).
export const SITE_URL = "https://transferaround.com";

export const SITE_NAME = "TransferAround";
export const CONTACT_EMAIL = "hello@transferaround.com";
export const CONTACT_PHONE = "+30 28 1000 0000";
export const CONTACT_PHONE_HREF = "tel:+302810000000";
/** WhatsApp deep link derived from the public dispatch number. */
export const CONTACT_WHATSAPP_HREF = "https://wa.me/302810000000";

/** App store URLs — override with VITE_APP_STORE_URL / VITE_PLAY_STORE_URL when published. */
export const APP_STORE_URL: string | undefined =
  import.meta.env.VITE_APP_STORE_URL || "https://transferaround.com/apps";
export const PLAY_STORE_URL: string | undefined =
  import.meta.env.VITE_PLAY_STORE_URL || "https://transferaround.com/apps";

/** Social profile URLs — set when accounts exist; footer shows icons either way. */
export const SOCIAL_FACEBOOK: string | undefined = undefined;
export const SOCIAL_INSTAGRAM: string | undefined = undefined;
export const SOCIAL_X: string | undefined = undefined;

/**
 * Default social-share image (absolute URL). Used as the fallback og:image /
 * twitter:image on every page that doesn't pass its own. TODO(phase-5): replace
 * with a dedicated, optimized 1200×630 og-default.png; logo.png (1672×941) is
 * the interim asset — a valid PNG at ~1.78:1, which social platforms accept.
 */
export const OG_DEFAULT_IMAGE = `${SITE_URL}/logo.png`;
