import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../contexts/store'
import { useSheetData } from '../useSheetData'
import { useSheetNames } from '../useSheetNames'
import { useMemo, useState } from 'react'
import { Select } from '../../../../components/select'
import { update_card } from '../../../../contexts/dashboard/functions/card/update'
import { IconSettings, IconHash, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'
import { Dialog } from '../../../../components/Dialog'

type Aggregation = 'sum' | 'average' | 'count' | 'latest' | 'min' | 'max'

const AGG_OPTIONS: { label: string; value: Aggregation }[] = [
  { label: 'Sum', value: 'sum' },
  { label: 'Average', value: 'average' },
  { label: 'Count', value: 'count' },
  { label: 'Latest', value: 'latest' },
  { label: 'Min', value: 'min' },
  { label: 'Max', value: 'max' },
]

function formatValue(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M'
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(2) + 'k'
  return Number.isInteger(n) ? n.toLocaleString() : n.toFixed(2)
}

function aggregate(nums: number[], agg: Aggregation): number {
  if (nums.length === 0) return 0
  switch (agg) {
    case 'sum': return nums.reduce((a, b) => a + b, 0)
    case 'average': return nums.reduce((a, b) => a + b, 0) / nums.length
    case 'count': return nums.length
    case 'latest': return nums[nums.length - 1]
    case 'min': return Math.min(...nums)
    case 'max': return Math.max(...nums)
  }
}

export default function ValueCard({ id }: { id: number }) {
  const dispatch = useDispatch<AppDispatch>()
  const card = useSelector((s: RootState) => s.dashboard.active.dashboard.structure.cards)[id]
  const dashboard = useSelector((s: RootState) => s.dashboard.active.dashboard)
  const linkedSheets = dashboard.structure.sheets ?? []

  const sheetId = card?.store?.sheetId
  const columnName = card?.store?.column
  const agg = (card?.store?.aggregation ?? 'sum') as Aggregation
  const prefix = (card?.store?.prefix ?? '') as string
  const suffix = (card?.store?.suffix ?? '') as string
  const { columns, rows, loading } = useSheetData(sheetId)
  const sheetNames = useSheetNames(linkedSheets)

  const [dialogOpen, setDialogOpen] = useState(false)
  const configured = sheetId && columnName

  const updateStore = (patch: Record<string, any>) => {
    dispatch(update_card({
      index: id,
      card: { ...card, store: { ...card.store, ...patch } },
    }))
  }

  const stats = useMemo(() => {
    if (!columnName || rows.length === 0) return null
    const colIdx = columns.findIndex(c => c.name === columnName)
    if (colIdx === -1) return null
    const nums = rows.map(r => Number(r[colIdx])).filter(n => !Number.isNaN(n))
    if (nums.length === 0) return null

    const value = aggregate(nums, agg)

    const halfLen = Math.floor(nums.length / 2)
    if (halfLen === 0) return { value, change: null, changeAbs: null }

    const recent = nums.slice(halfLen)
    const previous = nums.slice(0, halfLen)
    const recentVal = aggregate(recent, agg)
    const prevVal = aggregate(previous, agg)
    const changeAbs = recentVal - prevVal
    const change = prevVal !== 0 ? (changeAbs / Math.abs(prevVal)) * 100 : null

    return { value, change, changeAbs }
  }, [rows, columns, columnName, agg])

  const configDialog = (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Configure Value Card" widthClass="w-80">
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
              <>
                <Select
                  placeholder="Select column"
                  value={columnName}
                  options={columns.map(c => ({ label: c.name, value: c.name }))}
                  onChange={(val) => updateStore({ column: val })}
                />
                <Select
                  placeholder="Aggregation"
                  value={agg}
                  options={AGG_OPTIONS}
                  onChange={(val) => updateStore({ aggregation: val })}
                />
              </>
            )}
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
        <IconHash size={24} className="text-support-600" />
        <p className="text-xs text-support-500">No value configured</p>
        <button
          className="text-xs text-primary-400 hover:text-primary-300 rounded focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          onClick={() => setDialogOpen(true)}
        >
          Configure
        </button>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center gap-2">
        {configDialog}
        <p className="text-sm text-support-500">No numeric data</p>
        <button
          className="text-xs text-primary-400 hover:text-primary-300 rounded focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          onClick={() => setDialogOpen(true)}
        >
          Reconfigure
        </button>
      </div>
    )
  }

  const isPositive = stats.change !== null && stats.change >= 0
  const changeColor = stats.change === null
    ? 'text-support-500'
    : isPositive
      ? 'text-success-400'
      : 'text-danger-400'

  const badgeBg = stats.change === null
    ? 'bg-support-800/50'
    : isPositive
      ? 'bg-success-500/10'
      : 'bg-danger-500/10'

  return (
    <div className="flex flex-col h-full justify-between group/card p-4">
      {configDialog}

      <div className="flex items-start justify-between">
        <div className="space-y-0.5 min-w-0">
          <p className="text-sm font-semibold text-support-200 truncate">
            {card.store.label || columnName}
          </p>
          {sheetId && (
            <p className="text-xs text-support-500 truncate">
              {sheetNames.get(sheetId) ?? `Sheet #${sheetId}`}
            </p>
          )}
        </div>
        <button
          className="shrink-0 p-2 rounded text-support-600 opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 hover:text-support-300 hover:bg-hover-main focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          onClick={() => setDialogOpen(true)}
          aria-label="Configure card"
        >
          <IconSettings size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-1.5 mt-auto">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-2xl font-bold text-support-100 tracking-tight tabular-nums">
            {prefix}{formatValue(stats.value)}{suffix}
          </span>
          {stats.change !== null && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badgeBg} ${changeColor}`}>
              {isPositive
                ? <IconTrendingUp size={12} aria-hidden="true" />
                : <IconTrendingDown size={12} aria-hidden="true" />
              }
              {isPositive ? '+' : ''}{stats.change.toFixed(1)}%
            </span>
          )}
        </div>
        {stats.changeAbs !== null && (
          <p className="text-xs">
            <span className={`font-medium ${changeColor}`}>
              {stats.changeAbs >= 0 ? '+' : ''}{formatValue(stats.changeAbs)}
            </span>
            <span className="text-support-500 ml-1">vs prev. half</span>
          </p>
        )}
      </div>
    </div>
  )
}
