import { defineConfig } from "vite"
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin
} from "@remix-run/dev"
import tsconfigPaths from "vite-tsconfig-paths"
import tw from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    tw(),
    cloudflareDevProxyVitePlugin(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true
      }
    }),
    tsconfigPaths()
  ],
  ssr: {
    resolve: {
      conditions: ["workerd", "worker", "browser"]
    }
  },
  resolve: {
    mainFields: ["browser", "module", "main"]
  },
  build: {
    minify: true
  }
})
