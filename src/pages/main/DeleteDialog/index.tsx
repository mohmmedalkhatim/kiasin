import { IconAlertTriangle } from "@tabler/icons-react"
import { Dialog } from "../../../components/Dialog"
import Button from "../../../components/Button"
import type { Dashboard } from "../../../contexts/dashboard"

export default function DeleteDialog({ area, onClose, onConfirm }: {
  area: Dashboard | null
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={!!area} onClose={onClose} title="Delete dashboard" description="This action cannot be undone." widthClass="w-96">
      <div className="flex flex-col gap-4 px-6">
        <div className="flex items-start gap-3 rounded-lg border border-danger-500/20 bg-danger-500/5 p-3">
          <IconAlertTriangle size={20} className="text-danger-400 shrink-0 mt-0.5" />
          <p className="text-sm text-support-300">
            Delete <span className="font-semibold text-support-100">{area?.name}</span>? All cards and linked data will be permanently removed.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="tonal" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </Dialog>
  )
}
