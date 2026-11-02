/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STOREOS_API_KEY?: string;
  readonly VITE_STOREOS_GATEWAY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
