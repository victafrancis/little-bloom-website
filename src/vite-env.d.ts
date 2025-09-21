/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly glob: (pattern: string | string[], options?: any) => Record<string, () => Promise<any>>
  readonly globEager: (pattern: string | string[], options?: any) => Record<string, any>
}
