/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_PUBLIC_BASE_URL: string;
  readonly VITE_GAPI_API_KEY: string;
  readonly VITE_GAPI_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
