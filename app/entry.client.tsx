import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import { HydratedRouter } from "react-router/dom"
import { InstantProvider } from "./lib/hooks"

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <InstantProvider>
        <HydratedRouter />
      </InstantProvider>
    </StrictMode>
  )
})
