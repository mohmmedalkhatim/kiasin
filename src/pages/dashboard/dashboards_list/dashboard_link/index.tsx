import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { AppDispatch } from "../../../../contexts/store"
import { IconTrash, IconAlertTriangle } from "@tabler/icons-react"
import { delete_dashboard } from "../../../../contexts/dashboard/functions/delete"
import { Dashboard } from "../../../../contexts/dashboard"
import { Dispatch, SetStateAction, useState } from "react";
import { Dialog } from "../../../../components/Dialog"
import Button from "../../../../components/Button"

type Props = {
  dashboard: Dashboard,
  Refresh: Dispatch<SetStateAction<boolean>>
}

function DashboardLink({ dashboard, Refresh }: Props) {
  let dispatch = useDispatch<AppDispatch>()
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="dashboard_link border-border-main group/dashboard">
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete dashboard"
        description="This action cannot be undone."
        widthClass="w-96"
      >
        <div className="flex flex-col gap-4 px-6">
          <div className="flex items-start gap-3 rounded-lg border border-danger-500/20 bg-danger-500/5 p-3">
            <IconAlertTriangle size={20} className="text-danger-400 shrink-0 mt-0.5" />
            <p className="text-sm text-support-300">
              Are you sure you want to delete <span className="font-semibold text-support-100">{dashboard.name}</span>? All cards and linked data within this dashboard will be permanently removed.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="tonal" size="sm" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setConfirmOpen(false)
                Refresh(state => !state)
                dispatch(delete_dashboard(dashboard.id))
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>

      <Link to={`/dashboard/${dashboard.id}`} viewTransition className="w-full h-full grow">
        <div className=""></div>
      </Link>
      <div className="w-full border-t border-border-main p-3 flex items-center justify-between">
        <Link to={`/dashboard/${dashboard.id}`} viewTransition className="truncate">
          <span>{dashboard.name}</span>
        </Link>
        <button
          className="shrink-0 p-2 rounded text-support-600 opacity-0 group-hover/dashboard:opacity-100 focus-visible:opacity-100 transition-all duration-150 hover:text-support-300 hover:bg-hover-main focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          onClick={() => setConfirmOpen(true)}
          aria-label={`Delete ${dashboard.name}`}
        >
          <IconTrash size="1rem" />
        </button>
      </div>
    </div>
  )
}
export default DashboardLink
