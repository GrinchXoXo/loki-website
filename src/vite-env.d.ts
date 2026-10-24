/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOKI_DOWNLOAD_URL?: string
  readonly VITE_LOKI_TELEGRAM_CHANNEL_URL?: string
  readonly VITE_LOKI_FEEDBACK_URL?: string
  readonly VITE_LOKI_COMMUNITY_URL?: string
  readonly VITE_LOKI_SUPPORT_URL?: string
  readonly VITE_LOKI_SUPPORT_EMAIL?: string
  readonly VITE_LOKI_SETUP_GUIDE_URL?: string
  readonly VITE_LOKI_PRIVACY_URL?: string
  readonly VITE_LOKI_TERMS_URL?: string
  readonly VITE_LOKI_LEGAL_NAME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
