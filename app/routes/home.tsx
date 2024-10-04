import type { MetaFunction } from "react-router"
import { useInstant } from "~/lib/hooks"
import { Editor } from "./Editor"

export const meta: MetaFunction = () => {
  return [{ title: "Doowee" }]
}

export default function Index() {
  let db = useInstant()
  let { data } = db.useQuery({ item: {} })

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center h-16 px-4 bg-sky-50 gap-9">
        <h1 className="text-2xl font-bold text-gray-800">Doowee</h1>
      </header>
      <main className="flex flex-col items-center mt-10 p-4 border-zinc-500 text-xl w-full">
        <div className="divide-y divide-zinc-200 space-y-2 w-full">
          {data &&
            data.item.map((i) => (
              <div key={i.id} className="flex items-center gap-2 pb-2">
                <input
                  onChange={(e) => {
                    db.transact([
                      db.tx.item[i.id].update({
                        completed: !!e.currentTarget.checked
                      })
                    ])
                  }}
                  id={i.id}
                  type="checkbox"
                  checked={i.completed}
                />
                <label htmlFor={i.id}>{i.name}</label>
              </div>
            ))}
        </div>
        <div className="w-full">
          <Editor />
        </div>
      </main>
    </div>
  )
}
