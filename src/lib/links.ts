/**
 * Every outside link on the site, read from the .env file at build time.
 * Change a value in .env, rebuild and redeploy — no code changes needed.
 * A blank value falls back to a section on this page, so nothing breaks.
 */
const env = import.meta.env

const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const download = clean(env.VITE_LOKI_DOWNLOAD_URL)
const channel = clean(env.VITE_LOKI_TELEGRAM_CHANNEL_URL)
const feedback = clean(env.VITE_LOKI_FEEDBACK_URL)
const community = clean(env.VITE_LOKI_COMMUNITY_URL)
const support = clean(env.VITE_LOKI_SUPPORT_URL)
const supportEmail = clean(env.VITE_LOKI_SUPPORT_EMAIL)
const setupGuide = clean(env.VITE_LOKI_SETUP_GUIDE_URL)
const privacy = clean(env.VITE_LOKI_PRIVACY_URL)
const terms = clean(env.VITE_LOKI_TERMS_URL)
const partnerForm = clean(env.VITE_LOKI_PARTNER_FORM_URL)
const lokiApiUrl = clean(env.VITE_LOKI_API_URL)
const firebaseApiKey = clean(env.VITE_FIREBASE_API_KEY)
const firebaseAuthDomain = clean(env.VITE_FIREBASE_AUTH_DOMAIN)
const firebaseProjectId = clean(env.VITE_FIREBASE_PROJECT_ID)
const firebaseAppId = clean(env.VITE_FIREBASE_APP_ID)

// Section links start with "/" so they also work from the Privacy, Terms and
// Setup pages (from the home page they simply scroll).
export const LINKS = {
  /** "Get Loki" buttons: direct download of the Android app (APK). */
  download: download || '/#availability',
  /** Telegram announcements channel ("Updates", "Follow Loki"). */
  channel: channel || '/#footer',
  /** Feedback / bug-report form (e.g. Tally); falls back to the channel. */
  feedback: feedback || channel || '/#footer',
  /** Telegram discussion group; falls back to the channel. */
  community: community || channel || '/#footer',
  /** Customer support chat; falls back to the support email. */
  support: support || (supportEmail ? `mailto:${supportEmail}` : '/#footer'),
  /** Built-in pages unless .env points somewhere else. */
  setupGuide: setupGuide || '/setup',
  privacy: privacy || '/privacy',
  terms: terms || '/terms',
  partnerForm: partnerForm || support || '/partners#apply',
}

/** Settings used by the partner dashboard. */
export const LOKI_API_URL = lokiApiUrl || 'https://lokiapi.duckdns.org'
export const PARTNER_FIREBASE_CONFIG = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  appId: firebaseAppId,
}
export const PARTNER_SIGN_IN_AVAILABLE = Object.values(PARTNER_FIREBASE_CONFIG).every(Boolean)

/** Shown on the support and legal pages. */
export const SUPPORT_EMAIL = supportEmail

/** Who runs Loki, as named in the Privacy and Terms pages (e.g. a registered company). */
export const LEGAL_NAME = clean(env.VITE_LOKI_LEGAL_NAME) || 'Loki'


/** Open outside pages in a new tab; the app download stays in the same tab. */
export function externalProps(href: string): { target?: string; rel?: string } {
  if (!/^https?:\/\//i.test(href) || href === LINKS.download) return {}
  return { target: '_blank', rel: 'noopener noreferrer' }
}
