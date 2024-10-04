import { i } from "@instantdb/core"

let graph = i.graph(
  {
    item: i.entity({
      id: i.string().unique().indexed(),
      name: i.string(),
      completed: i.boolean(),
      category: i.string()
    }),
    user: i.entity({
      id: i.string().unique().indexed(),
      name: i.string()
    })
  },
  {
    userItems: {
      forward: {
        on: "user",
        has: "many",
        label: "items"
      },
      reverse: {
        on: "item",
        has: "one",
        label: "user"
      }
    }
  }
)

export default graph
