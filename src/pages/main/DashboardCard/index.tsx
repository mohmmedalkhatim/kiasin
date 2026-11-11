import { memo } from "react"
import { Link } from "react-router-dom"
import { IconPin, IconPinFilled, IconTrash } from "@tabler/icons-react"
import type { DashboardCardProps } from "../types"
import TagButton from "../TagButton"

const DashboardCard = memo(function DashboardCard({ area, pinned, onPin, onDelete, categories, dashCats, onTag, tagPopoverOpen, onTagPopover }: DashboardCardProps) {
  return (
    <div className="rounded-lg border border-border-main group/card duration-150 hover:shadow-lg hover:shadow-dark-900/30 flex flex-col">
      <Link to={`/dashboard/${area.id}`} viewTransition className="flex-1 p-4 pb-2">
        <span className="text-[13px] font-semibold block truncate transition-colors group-hover/card:text-primary-400">{area.name}</span>
        <span className="text-xs text-support-600 mt-1 block truncate leading-relaxed">{area.description || " "}</span>
      </Link>
      <div className={`px-4 pb-3 pt-1 flex items-center gap-1.5 transition-opacity duration-150 ${tagPopoverOpen ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'}`}>
        {dashCats.map(cid => {
          const cat = categories.find(c => c.id === cid)
          if (!cat) return null
          return <span key={cid} className="size-2 rounded-full shrink-0 opacity-50" style={{ backgroundColor: cat.color }} title={cat.name} />
        })}
        <div className="flex-1" />
        <TagButton
          area={area}
          categories={categories}
          dashCats={dashCats}
          onTag={onTag}
          open={tagPopoverOpen}
          onToggle={onTagPopover}
        />
        <button
          onClick={() => onPin(area.id)}
          className={`p-1.5 rounded-md transition-all duration-100 ${
            pinned
              ? 'text-primary-400 hover:bg-primary-600/10'
              : 'text-support-600 hover:text-support-300 hover:bg-hover-main'
          }`}
          aria-label={pinned ? "Unpin" : "Pin"}
        >
          {pinned ? <IconPinFilled size={14} /> : <IconPin size={14} />}
        </button>
        <button
          onClick={() => onDelete(area)}
          className="p-1.5 rounded-md text-support-600 hover:text-danger-400 hover:bg-danger-600/8 transition-all duration-100"
          aria-label="Delete"
        >
          <IconTrash size={14} />
        </button>
      </div>
    </div>
  )
})

export default DashboardCard
