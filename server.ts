import { createRequestHandler } from "react-router"
import * as build from "./build/server"

const handleRequest = createRequestHandler(build)

export default {
  async fetch(request, env, ctx) {
    const waitUntil = ctx.waitUntil.bind(ctx)
    const passThroughOnException = ctx.passThroughOnException.bind(ctx)

    try {
      const loadContext = {
        cloudflare: {
          // This object matches the return value from Wrangler's
          // `getPlatformProxy` used during development via React Router's
          // `cloudflareDevProxy`:
          // https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy
          cf: request.cf,
          ctx: { waitUntil, passThroughOnException },
          caches,
          env
        }
      }
      return await handleRequest(request, loadContext)
    } catch (error) {
      console.log(error)
      return new Response("An unexpected error occurred", { status: 500 })
    }
  }
} satisfies ExportedHandler<Env>
