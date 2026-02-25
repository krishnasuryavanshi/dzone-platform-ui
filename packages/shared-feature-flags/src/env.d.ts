/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly [key: `VITE_FF_${string}`]: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
