import type { MetaFunction } from "react-router"
import { Editor } from "./Editor"

export const meta: MetaFunction = () => {
  return [{ title: "Doowee" }]
}

export default function Index() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center h-16 px-4 bg-sky-50 gap-9">
        <h1 className="text-2xl font-bold text-gray-800">Doowee</h1>
      </header>
      <main className="flex flex-col items-center mt-10 p-4 border-zinc-500 text-xl w-full">
        <div className="w-full">
          <Editor />
        </div>
      </main>
    </div>
  )
}
