// Single source of truth for absolute URLs (canonical, hreflang, sitemap, JSON-LD).
export const SITE_URL = "https://transferaround.com";

export const SITE_NAME = "TransferAround";
export const CONTACT_EMAIL = "hello@transferaround.com";
export const CONTACT_PHONE = "+30 695 588 5718";
export const CONTACT_PHONE_HREF = "tel:+306955885718";
/** WhatsApp deep link derived from the public dispatch number. */
export const CONTACT_WHATSAPP_HREF = "https://wa.me/306955885718";

/** App store URLs — override with VITE_APP_STORE_URL / VITE_PLAY_STORE_URL when published. */
export const APP_STORE_URL: string | undefined = import.meta.env.VITE_APP_STORE_URL || undefined;
export const PLAY_STORE_URL: string | undefined = import.meta.env.VITE_PLAY_STORE_URL || undefined;

/** Social profile URLs — set when accounts exist; footer shows icons either way. */
export const SOCIAL_FACEBOOK: string | undefined = undefined;
export const SOCIAL_INSTAGRAM: string | undefined = undefined;
export const SOCIAL_X: string | undefined = undefined;

/** Approved square Interchange artwork for social previews and organization identity. */
export const OG_DEFAULT_IMAGE = `${SITE_URL}/brand/rider-icon-v3.png`;
