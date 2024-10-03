import type { MetaFunction } from "@remix-run/node"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" }
  ]
}

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <header className="flex flex-col items-center gap-9">
        <h1 className="leading text-2xl font-bold text-gray-800">
          Welcome to Remix on Cloudflare Workers!
        </h1>
      </header>
    </div>
  )
}
