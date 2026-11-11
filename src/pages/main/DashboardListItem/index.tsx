import { memo } from "react"
import { Link } from "react-router-dom"
import { IconPin, IconPinFilled, IconTrash } from "@tabler/icons-react"
import type { DashboardCardProps } from "../types"
import TagButton from "../TagButton"

const DashboardListItem = memo(function DashboardListItem({ area, pinned, onPin, onDelete, categories, dashCats, onTag, tagPopoverOpen, onTagPopover }: DashboardCardProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 group hover:bg-hover-subtle transition-colors duration-100">
      <Link to={`/dashboard/${area.id}`} viewTransition className="flex-1 min-w-0 flex items-center gap-3">
        <span className="flex items-center gap-1.5 min-w-0">
          <span className="text-[13px] font-medium truncate transition-colors group-hover:text-primary-400">{area.name}</span>
          {dashCats.map(cid => {
            const cat = categories.find(c => c.id === cid)
            if (!cat) return null
            return <span key={cid} className="size-2 rounded-full shrink-0 opacity-50" style={{ backgroundColor: cat.color }} title={cat.name} />
          })}
        </span>
        {area.description && (
          <span className="text-xs text-support-600 truncate ml-auto shrink hidden sm:block">{area.description}</span>
        )}
      </Link>
      <div className={`flex items-center gap-0.5 transition-opacity duration-150 ${tagPopoverOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
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
            pinned ? 'text-primary-400' : 'text-support-600 hover:text-support-300 hover:bg-hover-main'
          }`}
        >
          {pinned ? <IconPinFilled size={13} /> : <IconPin size={13} />}
        </button>
        <button
          onClick={() => onDelete(area)}
          className="p-1.5 rounded-md text-support-600 hover:text-danger-400 hover:bg-danger-600/8 transition-all duration-100"
        >
          <IconTrash size={13} />
        </button>
      </div>
    </div>
  )
})

export default DashboardListItem
