import { IconX } from "@tabler/icons-react"
import { Dialog } from "../../../components/Dialog"
import Button from "../../../components/Button"
import type { Category } from "../../../lib/storage"
import { CATEGORY_COLORS } from "../types"

export default function CategoryDialog({ open, onClose, categories, newCatName, onNameChange, newCatColor, onColorChange, onAdd, onDelete }: {
  open: boolean
  onClose: () => void
  categories: Category[]
  newCatName: string
  onNameChange: (v: string) => void
  newCatColor: string
  onColorChange: (v: string) => void
  onAdd: () => void
  onDelete: (id: string) => void
}) {
  return (
    <Dialog open={open} onClose={onClose} title="Manage Categories" widthClass="w-[400px]">
      <div className="px-6 space-y-5">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              value={newCatName}
              onChange={e => onNameChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onAdd()}
              placeholder="New category"
              className="flex-1 h-8 px-3 text-xs rounded-md border border-border-main bg-transparent text-support-200 placeholder:text-support-500 focus:outline-none focus:border-primary-600/50 transition-colors"
            />
            <Button size="xs" onClick={onAdd}>Add</Button>
          </div>
          <div className="flex gap-1.5 items-center">
            {CATEGORY_COLORS.map(color => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className="size-5 rounded-full transition-all duration-100 border-2"
                style={{
                  backgroundColor: color,
                  borderColor: newCatColor === color ? color : 'transparent',
                  boxShadow: newCatColor === color ? `0 0 0 2px var(--color-dark-900), 0 0 0 4px ${color}50` : 'none'
                }}
              />
            ))}
          </div>
        </div>
        <div className="space-y-0.5 max-h-56 overflow-y-auto -mx-2 px-2">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-hover-main group transition-colors duration-100">
              <div className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-sm text-support-200">{cat.name}</span>
              </div>
              <button
                onClick={() => onDelete(cat.id)}
                className="text-support-700 hover:text-danger-400 opacity-0 group-hover:opacity-100 transition-all duration-100 p-1 rounded"
              >
                <IconX size={13} />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-xs text-support-600 text-center py-6">No categories yet</p>
          )}
        </div>
      </div>
    </Dialog>
  )
}
