import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../contexts/store'
import { useSheetData } from '../useSheetData'
import { useSheetNames } from '../useSheetNames'
import { useMemo, useState } from 'react'
import { Select } from '../../../../components/select'
import { update_card } from '../../../../contexts/area/functions/card/update'
import { IconSettings, IconChartBar, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'
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

function formatDisplay(n: number, prefix: string): string {
  if (Math.abs(n) >= 1_000_000) return `${prefix} ${(n / 1_000_000).toFixed(2)}M`
  if (Math.abs(n) >= 1_000) return `${prefix} ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  return `${prefix} ${Number.isInteger(n) ? n.toLocaleString() : n.toFixed(2)}`
}

function formatCompact(n: number, prefix: string): string {
  if (Math.abs(n) >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${prefix}${(n / 1_000).toFixed(1)}k`
  return `${prefix}${Number.isInteger(n) ? String(n) : n.toFixed(2)}`
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

export default function RevenueCard({ id }: { id: number }) {
  const dispatch = useDispatch<AppDispatch>()
  const card = useSelector((s: RootState) => s.area.active.area.structure.cards)[id]
  const area = useSelector((s: RootState) => s.area.active.area)
  const linkedSheets = area.structure.sheets ?? []

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
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length
    const count = nums.length

    const halfLen = Math.floor(nums.length / 2)
    if (halfLen === 0) return { value, avg, count, change: null, changeAbs: null }

    const recent = nums.slice(halfLen)
    const previous = nums.slice(0, halfLen)
    const recentVal = aggregate(recent, agg)
    const prevVal = aggregate(previous, agg)
    const changeAbs = recentVal - prevVal
    const change = prevVal !== 0 ? (changeAbs / Math.abs(prevVal)) * 100 : null

    return { value, avg, count, change, changeAbs }
  }, [rows, columns, columnName, agg])

  const configDialog = (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Configure Revenue Card" widthClass="w-80">
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
        <IconChartBar size={24} className="text-support-600" />
        <p className="text-xs text-support-500">No revenue card configured</p>
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
    <div className="flex flex-col h-full group/card">
      {configDialog}

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-primary-600/10 flex items-center justify-center">
            <IconChartBar size={18} className="text-primary-400" />
          </div>
          <span className="text-sm font-semibold text-support-200 truncate">
            {card.store.label || columnName}
          </span>
        </div>
        <button
          className="shrink-0 p-2 rounded text-support-600 opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 hover:text-support-300 hover:bg-hover-main focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          onClick={() => setDialogOpen(true)}
          aria-label="Configure card"
        >
          <IconSettings size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="px-5 flex flex-col gap-3.5 flex-1">
        {/* Big value */}
        <div>
          <div className="flex items-baseline gap-2.5 mb-2">
            <span className="text-3xl font-bold text-support-100 tracking-tight tabular-nums">
              {formatDisplay(stats.value, prefix)}
            </span>
            {suffix && (
              <span className="text-xs text-support-500 font-medium leading-none">{suffix.trim()}</span>
            )}
          </div>

          {/* Change badge + description */}
          {stats.change !== null && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${badgeBg} ${changeColor}`}>
                {isPositive
                  ? <IconTrendingUp size={12} aria-hidden="true" />
                  : <IconTrendingDown size={12} aria-hidden="true" />
                }
                {isPositive ? '+' : ''}{stats.change.toFixed(1)}%
              </span>
              <span className="text-xs text-support-500">
                {isPositive ? 'increased' : 'decreased'} from prev. half
              </span>
            </div>
          )}
        </div>

        {/* Secondary stat rows */}
        <div className="mt-auto pb-5 flex flex-col gap-1">
          <div className="flex items-center justify-between px-3 py-2.5 bg-hover-subtle rounded-lg">
            <span className="text-xs text-support-400">Avg. Value:</span>
            <span className="text-sm font-semibold text-support-200 tabular-nums">
              {formatCompact(stats.avg, prefix)}
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-2.5 bg-hover-subtle rounded-lg">
            <span className="text-xs text-support-400">Total Entries:</span>
            <span className="text-sm font-semibold text-support-200 tabular-nums">
              {stats.count.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
