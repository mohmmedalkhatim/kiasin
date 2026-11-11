import { useEffect, useRef } from "react"
import { IconTag } from "@tabler/icons-react"
import type { Dashboard } from "../../../contexts/dashboard"
import type { Category } from "../../../lib/storage"

export default function TagButton({ area, categories, dashCats, onTag, open, onToggle }: {
  area: Dashboard
  categories: Category[]
  dashCats: string[]
  onTag: (dashboardId: number, categoryId: string) => void
  open: boolean
  onToggle: (id: number | null) => void
}) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) onToggle(null)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open, onToggle])

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => onToggle(open ? null : area.id)}
        className="p-1.5 rounded-md text-support-600 hover:text-support-300 hover:bg-hover-main transition-all duration-100"
        aria-label="Tag dashboard"
      >
        <IconTag size={14} />
      </button>
      {open && (
        <div className="absolute right-0 bottom-full mb-1.5 z-50 bg rounded-lg border border-border-main shadow-xl shadow-dark-900/50 py-1 min-w-40 animate-[selectEnter_120ms_ease-out]">
          {categories.length === 0 ? (
            <p className="px-3 py-2.5 text-xs text-support-600">No categories</p>
          ) : categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onTag(area.id, cat.id)}
              className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-hover-main transition-colors duration-100 flex items-center gap-2"
            >
              <span className="size-2 rounded-full shrink-0 opacity-50" style={{ backgroundColor: cat.color }} />
              <span className="flex-1">{cat.name}</span>
              {dashCats.includes(cat.id) && <span className="text-primary-400 text-[11px]">&#10003;</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
