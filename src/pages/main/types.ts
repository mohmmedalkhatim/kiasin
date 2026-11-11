import type { Dashboard } from "../../contexts/dashboard"
import type { Category } from "../../lib/storage"

export const CATEGORY_COLORS = [
  "#3791cf", "#e22732", "#2bb370", "#ff9100", "#00afff",
  "#9a4dff", "#ff6b9d", "#ffd333"
]

export interface DashboardCardProps {
  area: Dashboard
  pinned: boolean
  onPin: (id: number) => void
  onDelete: (area: Dashboard) => void
  categories: Category[]
  dashCats: string[]
  onTag: (dashboardId: number, categoryId: string) => void
  tagPopoverOpen: boolean
  onTagPopover: (id: number | null) => void
}
