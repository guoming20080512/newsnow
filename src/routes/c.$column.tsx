import { createFileRoute } from "@tanstack/react-router"
import { Column } from "~/components/column"

export const Route = createFileRoute("/c/$column")({
  component: SectionComponent,
  params: {
    parse: (params) => {
      const column = fixedColumnIds.find(x => x === params.column.toLowerCase())
      if (!column) throw new Error(`"${params.column}" is not a valid column.`)
      return {
        column,
      }
    },
    stringify: params => params,
  },
  errorComponent: ({ error }: any) => {
    if (error?.routerCode === "PARSE_PARAMS") {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="text-6xl mb-4">📂</div>
          <h1 className="text-2xl font-bold mb-2">分类不存在</h1>
          <p className="text-neutral-500 mb-4">您访问的分类不存在</p>
          <button
            type="button"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-80 transition-opacity"
            onClick={() => {
              const nav = Route.useNavigate()
              nav({ to: "/" })
            }}
          >
            返回首页
          </button>
        </div>
      )
    }
    throw error
  },
})

function SectionComponent() {
  const { column } = Route.useParams()
  return <Column id={column} />
}
