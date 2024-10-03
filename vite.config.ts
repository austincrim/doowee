import { defineConfig } from "vite"
import { reactRouter } from "@react-router/dev/vite"
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare"
import tsconfigPaths from "vite-tsconfig-paths"
import tw from "@tailwindcss/vite"

export default defineConfig({
  plugins: [cloudflareDevProxy(), tw(), reactRouter(), tsconfigPaths()],
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
