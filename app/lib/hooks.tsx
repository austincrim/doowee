import { init_experimental } from "@instantdb/react"
import graph from "instant.schema"
import { createContext, useContext } from "react"

export let db = init_experimental({
  appId: "f515f84e-a34b-4ef8-a3b2-aa341b9a4fd5",
  schema: graph,
  devtool: false
})

let InstantContext = createContext(db)

export function InstantProvider({ children }: { children: React.ReactNode }) {
  return (
    <InstantContext.Provider value={db}>{children}</InstantContext.Provider>
  )
}

export function useInstant() {
  let db = useContext(InstantContext)
  if (!db) {
    throw new Error("must be in an InstantProvider")
  }

  return db
}
