/**
 * Public branding — set once in `.env` (VITE_* vars).
 * Used across UI, Helmet, and structured data.
 */

export const COMPANY_NAME =
  import.meta.env.VITE_COMPANY_NAME?.trim() || "Precision Parts Kenya";

/** Compact label (e.g. mobile menu header) */
export const COMPANY_SHORT_NAME =
  import.meta.env.VITE_COMPANY_SHORT_NAME?.trim() ||
  COMPANY_NAME.replace(/\s+Kenya\s*$/i, "").trim() ||
  COMPANY_NAME;

/** One-line value proposition */
export const COMPANY_TAGLINE =
  import.meta.env.VITE_COMPANY_TAGLINE?.trim() ||
  "Genuine automotive spare parts — fast delivery across Kenya.";

/** Browser tab / default document title (Helmet overrides per route) */
export const SITE_DEFAULT_TITLE =
  import.meta.env.VITE_SITE_DEFAULT_TITLE?.trim() ||
  `${COMPANY_NAME} — Automotive Spare Parts`;

export const SITE_DEFAULT_DESCRIPTION =
  import.meta.env.VITE_SITE_DEFAULT_DESCRIPTION?.trim() ||
  `${COMPANY_TAGLINE} Search parts, order online, or order via WhatsApp.`;

/** Home hero headline & subcopy */
export const HERO_TITLE =
  import.meta.env.VITE_HERO_TITLE?.trim() || "Genuine Parts. Precision Fit.";

export const HERO_SUBTITLE =
  import.meta.env.VITE_HERO_SUBTITLE?.trim() ||
  "OEM-quality spares — search, order by phone, or checkout online.";

/** Logo alt text */
export const LOGO_ALT = `${COMPANY_NAME} logo`;

/** Contact and ordering channels */
export const CONTACT_PHONE_DISPLAY =
  import.meta.env.VITE_CONTACT_PHONE_DISPLAY?.trim() || "0790 831798";

/** Dial-safe number (no spaces) */
export const CONTACT_PHONE_TEL =
  import.meta.env.VITE_CONTACT_PHONE_TEL?.trim() || "0790831798";

/** E.164 without "+" for wa.me links */
export const WHATSAPP_ORDER_NUMBER =
  import.meta.env.VITE_WHATSAPP_ORDER_NUMBER?.trim() || "254790831798";

export const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL?.trim() || "support@precisionparts.co.ke";

export const ORDERS_EMAIL =
  import.meta.env.VITE_ORDERS_EMAIL?.trim() || "orders@precisionparts.co.ke";

/** Canonical site origin — used in Helmet canonical/OG URLs */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL?.trim() || "https://precisionparts.co.ke").replace(/\/+$/, "");
