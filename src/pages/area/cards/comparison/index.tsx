import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../contexts/store'
import { useSheetData } from '../useSheetData'
import { useSheetNames } from '../useSheetNames'
import { useMemo, useState } from 'react'
import { Select } from '../../../../components/select'
import { update_card } from '../../../../contexts/area/functions/card/update'
import { IconArrowUpRight, IconArrowDownRight, IconMinus, IconScale, IconSettings } from '@tabler/icons-react'
import { Dialog } from '../../../../components/Dialog'

function formatValue(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return Number.isInteger(n) ? String(n) : n.toFixed(2)
}

function columnSum(rows: any[][], columns: { name: string }[], colName: string): number | null {
  const idx = columns.findIndex(c => c.name === colName)
  if (idx === -1) return null
  const nums = rows.map(r => Number(r[idx])).filter(n => !Number.isNaN(n))
  if (nums.length === 0) return null
  return nums.reduce((a, b) => a + b, 0)
}

export default function ComparisonCard({ id }: { id: number }) {
  const dispatch = useDispatch<AppDispatch>()
  const card = useSelector((s: RootState) => s.area.active.area.structure.cards)[id]
  const area = useSelector((s: RootState) => s.area.active.area)
  const linkedSheets = area.structure.sheets ?? []

  const sheetIdA = card?.store?.sheetId
  const sheetIdB = card?.store?.sheetIdB
  const colA = card?.store?.column
  const colB = card?.store?.columnB
  const dataA = useSheetData(sheetIdA)
  const dataB = useSheetData(sheetIdB)
  const sheetNames = useSheetNames(linkedSheets)

  const [dialogOpen, setDialogOpen] = useState(false)
  const configured = sheetIdA && sheetIdB && colA && colB

  const updateStore = (patch: Record<string, any>) => {
    dispatch(update_card({
      index: id,
      card: { ...card, store: { ...card.store, ...patch } },
    }))
  }

  const comparison = useMemo(() => {
    if (!colA || !colB) return null
    if (dataA.rows.length === 0 || dataB.rows.length === 0) return null
    const sumA = columnSum(dataA.rows, dataA.columns, colA)
    const sumB = columnSum(dataB.rows, dataB.columns, colB)
    if (sumA === null || sumB === null) return null

    const delta = sumA - sumB
    const pct = sumB !== 0 ? ((delta / Math.abs(sumB)) * 100) : 0

    return { sumA, sumB, delta, pct }
  }, [dataA.rows, dataA.columns, dataB.rows, dataB.columns, colA, colB])

  const sheetOptions = linkedSheets.map(sid => ({ label: sheetNames.get(sid) ?? `Sheet #${sid}`, value: String(sid) }))
  const loading = dataA.loading || dataB.loading

  const configDialog = (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Configure Comparison" widthClass="w-80">
      <div className="flex flex-col gap-4 px-6">
        {linkedSheets.length === 0 ? (
          <p className="text-xs text-support-500">Link a sheet to this area first.</p>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-support-400 uppercase tracking-wide">Side A</span>
              <Select
                placeholder="Select sheet"
                value={sheetIdA ? String(sheetIdA) : undefined}
                options={sheetOptions}
                onChange={(val) => updateStore({ sheetId: Number(val), column: undefined })}
              />
              {sheetIdA && dataA.columns.length > 0 && (
                <Select
                  placeholder="Select column"
                  value={colA}
                  options={dataA.columns.map(c => ({ label: c.name, value: c.name }))}
                  onChange={(val) => updateStore({ column: val })}
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-support-400 uppercase tracking-wide">Side B</span>
              <Select
                placeholder="Select sheet"
                value={sheetIdB ? String(sheetIdB) : undefined}
                options={sheetOptions}
                onChange={(val) => updateStore({ sheetIdB: Number(val), columnB: undefined })}
              />
              {sheetIdB && dataB.columns.length > 0 && (
                <Select
                  placeholder="Select column"
                  value={colB}
                  options={dataB.columns.map(c => ({ label: c.name, value: c.name }))}
                  onChange={(val) => updateStore({ columnB: val })}
                />
              )}
            </div>
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
        <IconScale size={24} className="text-support-600" />
        <p className="text-xs text-support-500">No comparison configured</p>
        <button
          className="text-xs text-primary-400 hover:text-primary-300 rounded focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          onClick={() => setDialogOpen(true)}
        >
          Configure
        </button>
      </div>
    )
  }

  const labelA = card.store.label || colA
  const labelB = card.store.labelB || colB

  if (!comparison) {
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

  const { sumA, sumB, delta, pct } = comparison
  const isPositive = delta > 0
  const isNeutral = delta === 0

  return (
    <div className="flex flex-col h-full group/card">
      {configDialog}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-xs font-medium text-support-500 uppercase tracking-wide truncate">
          Comparison
        </span>
        <button
          className="p-2 rounded text-support-600 opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 hover:text-support-300 hover:bg-hover-main focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          onClick={() => setDialogOpen(true)}
          aria-label="Configure card"
        >
          <IconSettings size={14} />
        </button>
      </div>

      <div className="flex-1 flex items-center px-4 pb-4">
        <div className="w-full rounded-lg border border-border-main bg-hover-subtle p-3 flex flex-col gap-3">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-support-500 uppercase tracking-wide truncate">{labelA}</span>
              <span className="text-xl font-semibold text-support-100 tabular-nums">{formatValue(sumA)}</span>
            </div>
            <div className="text-support-600 text-lg">vs</div>
            <div className="flex flex-col min-w-0 text-right">
              <span className="text-[10px] text-support-500 uppercase tracking-wide truncate">{labelB}</span>
              <span className="text-xl font-semibold text-support-100 tabular-nums">{formatValue(sumB)}</span>
            </div>
          </div>

          <div className="border-t border-border-main pt-3">
            <div className={`flex items-center gap-1.5 text-sm font-medium ${
              isNeutral ? 'text-support-400' : isPositive ? 'text-success-400' : 'text-danger-400'
            }`}>
              {isNeutral
                ? <IconMinus size={16} />
                : isPositive
                  ? <IconArrowUpRight size={16} />
                  : <IconArrowDownRight size={16} />
              }
              <span className="tabular-nums">
                {isPositive ? '+' : ''}{formatValue(delta)}
              </span>
              <span className="text-xs text-support-500">
                ({isPositive ? '+' : ''}{pct.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
