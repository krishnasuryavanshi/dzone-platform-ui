/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_CRYPTO_KEY: string;
  readonly VITE_GA_TRACKING_ID?: string;
  readonly VITE_CLARITY_TRACKING_ID?: string;
  readonly VITE_LOGGER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
