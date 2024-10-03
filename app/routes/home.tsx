import type { MetaFunction } from "react-router"
import type * as Route from "./+types.home"

export const meta: MetaFunction = () => {
  return [
    { title: "New RR7 App" },
    { name: "description", content: "Welcome to RR7!" }
  ]
}

export function loader() {
  return { message: "Welcome to RR7 on Cloudflare Workers!" }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex h-screen items-center justify-center">
      <header className="flex flex-col items-center gap-9">
        <h1 className="leading text-2xl font-bold text-gray-800">
          {loaderData.message}
        </h1>
      </header>
    </div>
  )
}
