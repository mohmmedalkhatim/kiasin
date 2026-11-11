import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../contexts/store'
import { useSheetData } from '../useSheetData'
import { useSheetNames } from '../useSheetNames'
import { useMemo, useState } from 'react'
import { Select } from '../../../../components/select'
import { update_card } from '../../../../contexts/dashboard/functions/card/update'
import { IconSettings, IconTargetArrow } from '@tabler/icons-react'
import { Dialog } from '../../../../components/Dialog'
import Input from '../../../../components/input'

function formatValue(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return Number.isInteger(n) ? String(n) : n.toFixed(2)
}

function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className="relative h-2 w-full overflow-hidden rounded-full bg-primary-600/20"
    >
      <div
        className="h-full rounded-full bg-primary-500 transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export default function ProgressCard({ id }: { id: number }) {
  const dispatch = useDispatch<AppDispatch>()
  const card = useSelector((s: RootState) => s.dashboard.active.dashboard.structure.cards)[id]
  const dashboard = useSelector((s: RootState) => s.dashboard.active.dashboard)
  const linkedSheets = dashboard.structure.sheets ?? []

  const sheetId = card?.store?.sheetId
  const columnName = card?.store?.column
  const limit = card?.store?.limit ?? 0
  const { columns, rows, loading } = useSheetData(sheetId)
  const sheetNames = useSheetNames(linkedSheets)

  const [dialogOpen, setDialogOpen] = useState(false)
  const configured = sheetId && columnName && limit > 0

  const updateStore = (patch: Record<string, any>) => {
    dispatch(update_card({
      index: id,
      card: { ...card, store: { ...card.store, ...patch } },
    }))
  }

  const stats = useMemo(() => {
    if (!columnName || rows.length === 0 || !limit) return null
    const colIdx = columns.findIndex(c => c.name === columnName)
    if (colIdx === -1) return null
    const nums = rows.map(r => Number(r[colIdx])).filter(n => !Number.isNaN(n))
    if (nums.length === 0) return null
    const sum = nums.reduce((a, b) => a + b, 0)
    const percentage = (sum / limit) * 100
    return { sum, percentage }
  }, [rows, columns, columnName, limit])

  const configDialog = (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Configure Progress Card" widthClass="w-80">
      <div className="flex flex-col gap-3 px-6">
        {linkedSheets.length === 0 ? (
          <p className="text-xs text-support-500">Link a sheet to this area first.</p>
        ) : (
          <>
            <Select
              placeholder="Select sheet"
              value={sheetId ? String(sheetId) : undefined}
              options={linkedSheets.map(sid => ({ label: sheetNames.get(sid) ?? `Sheet #${sid}`, value: String(sid) }))}
              onChange={(val) => updateStore({ sheetId: Number(val), column: undefined })}
            />
            {sheetId && columns.length > 0 && (
              <Select
                placeholder="Select column"
                value={columnName}
                options={columns.map(c => ({ label: c.name, value: c.name }))}
                onChange={(val) => updateStore({ column: val })}
              />
            )}
            <Input
              label="Target / Limit"
              type="number"
              placeholder="e.g. 10000"
              value={limit ? String(limit) : ''}
              onChange={(e) => updateStore({ limit: Number(e.target.value) || 0 })}
            />
            {loading && <p className="text-xs text-support-500">Loading…</p>}
          </>
        )}
      </div>
    </Dialog>
  )

  if (!configured) {
    return (
      <div className="p-4 flex flex-col items-center justify-center gap-3 h-full">
        {configDialog}
        <IconTargetArrow size={24} className="text-support-600" />
        <p className="text-xs text-support-500">No progress configured</p>
        <button
          className="text-xs text-primary-400 hover:text-primary-300 rounded focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          onClick={() => setDialogOpen(true)}
        >
          Configure
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full group/card">
      {configDialog}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-xs font-medium text-support-500 uppercase tracking-wide truncate">
          {card.store.label || columnName}
        </span>
        <button
          className="p-2 rounded text-support-600 opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 hover:text-support-300 hover:bg-hover-main focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          onClick={() => setDialogOpen(true)}
          aria-label="Configure card"
        >
          <IconSettings size={14} />
        </button>
      </div>

      {stats ? (
        <div className="flex-1 flex items-center px-4 pb-4">
          <div className="w-full flex flex-col gap-1">
            <span className="text-2xl font-semibold text-support-100 tabular-nums">
              {formatValue(stats.sum)}
            </span>
            <ProgressBar value={stats.percentage} />
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-primary-400 font-medium tabular-nums">
                {stats.percentage.toFixed(2)}%
              </span>
              <span className="text-support-500">
                {formatValue(stats.sum)} of {formatValue(limit)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4 gap-2">
          <p className="text-sm text-support-500">No numeric data</p>
          <button
            className="text-xs text-primary-400 hover:text-primary-300 rounded focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
            onClick={() => setDialogOpen(true)}
          >
            Reconfigure
          </button>
        </div>
      )}
    </div>
  )
}
