import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import type { Dashboard } from "../../../contexts/dashboard"
import type { Category } from "../../../lib/storage"

export default function RecentStrip({ dashboards, categories, dashboardCategories }: {
  dashboards: Dashboard[]
  categories: Category[]
  dashboardCategories: Record<number, string[]>
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    el?.addEventListener('scroll', checkScroll, { passive: true })
    return () => el?.removeEventListener('scroll', checkScroll)
  }, [checkScroll, dashboards])

  return (
    <div className="relative">
      {canScrollLeft && <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-dark-900 to-transparent" />}
      {canScrollRight && <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-l from-dark-900 to-transparent" />}
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {dashboards.map(area => {
          const cats = dashboardCategories[area.id] ?? []
          return (
            <Link
              key={area.id}
              to={`/dashboard/${area.id}`}
              viewTransition
              className="shrink-0 w-52 rounded-lg border border-border-main p-4 transition-colors duration-150 hover:border-border-strong hover:bg-hover-subtle group"
            >
              <span className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-medium truncate transition-colors group-hover:text-primary-400">{area.name}</span>
                {cats.map(cid => {
                  const cat = categories.find(c => c.id === cid)
                  if (!cat) return null
                  return <span key={cid} className="size-2 rounded-full shrink-0 opacity-50" style={{ backgroundColor: cat.color }} title={cat.name} />
                })}
              </span>
              <span className="text-xs text-support-600 mt-1.5 block truncate leading-relaxed">{area.description || " "}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
