import { createFileRoute } from "@tanstack/react-router"
import { useTitle } from "react-use"
import { sources } from "@shared/sources"
import { NavBar } from "~/components/navbar"
import { CardWrapper } from "~/components/column/card"

export const Route = createFileRoute("/source/$name")({
  component: SourceComponent,
})

function SourceComponent() {
  const { name } = Route.useParams()

  useTitle(`NewsNow | ${sources[name]?.name || name}`)

  return (
    <>
      <div className="flex justify-center md:hidden mb-6">
        <NavBar />
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-[350px]">
          <CardWrapper id={name} />
        </div>
      </div>
    </>
  )
}
