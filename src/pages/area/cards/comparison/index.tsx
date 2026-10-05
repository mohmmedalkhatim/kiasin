import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../contexts/store'
import { useSheetData } from '../useSheetData'
import { useSheetNames } from '../useSheetNames'
import { useMemo, useState } from 'react'
import { Select } from '../../../../components/select'
import { update_card } from '../../../../contexts/area/functions/card/update'
import { IconArrowUpRight, IconArrowDownRight, IconMinus, IconScale, IconSettings } from '@tabler/icons-react'

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

  const sheetId = card?.store?.sheetId
  const colA = card?.store?.column
  const colB = card?.store?.columnB
  const { columns, rows, sheet, loading } = useSheetData(sheetId)
  const sheetNames = useSheetNames(linkedSheets)

  const [configuring, setConfiguring] = useState(!sheetId || !colA || !colB)

  const updateStore = (patch: Record<string, any>) => {
    dispatch(update_card({
      index: id,
      card: { ...card, store: { ...card.store, ...patch } },
    }))
  }

  const comparison = useMemo(() => {
    if (!colA || !colB || rows.length === 0) return null
    const sumA = columnSum(rows, columns, colA)
    const sumB = columnSum(rows, columns, colB)
    if (sumA === null || sumB === null) return null

    const delta = sumA - sumB
    const pct = sumB !== 0 ? ((delta / Math.abs(sumB)) * 100) : 0

    return { sumA, sumB, delta, pct }
  }, [rows, columns, colA, colB])

  if (configuring || !sheetId || !colA || !colB) {
    return (
      <div className="p-4 flex flex-col gap-3 h-full">
        <div className="flex items-center gap-2 text-sm font-medium text-support-300">
          <IconScale size={16} />
          Comparison
        </div>
        {linkedSheets.length === 0 ? (
          <p className="text-xs text-support-500">Link a sheet to this area first.</p>
        ) : (
          <>
            <Select
              placeholder="Select sheet"
              value={sheetId ? String(sheetId) : undefined}
              options={linkedSheets.map(sid => ({ label: sheetNames.get(sid) ?? `Sheet #${sid}`, value: String(sid) }))}
              onChange={(val) => updateStore({ sheetId: Number(val), column: undefined, columnB: undefined })}
            />
            {sheetId && columns.length > 0 && (
              <>
                <Select
                  placeholder="Column A"
                  value={colA}
                  options={columns.map(c => ({ label: c.name, value: c.name }))}
                  onChange={(val) => updateStore({ column: val })}
                />
                <Select
                  placeholder="Column B"
                  value={colB}
                  options={columns.filter(c => c.name !== colA).map(c => ({ label: c.name, value: c.name }))}
                  onChange={(val) => {
                    updateStore({ columnB: val })
                    setConfiguring(false)
                  }}
                />
              </>
            )}
            {loading && <p className="text-xs text-support-500">Loading…</p>}
          </>
        )}
      </div>
    )
  }

  const labelA = card.store.label || colA
  const labelB = card.store.labelB || colB

  if (!comparison) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center gap-2">
        <p className="text-sm text-support-500">No numeric data</p>
        <button
          className="text-xs text-primary-400 hover:text-primary-300"
          onClick={() => setConfiguring(true)}
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
    <div className="p-4 flex flex-col justify-between h-full group/card">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-support-600">{sheet?.name}</span>
        <button
          className="p-1 rounded text-support-600 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150 hover:text-support-300 hover:bg-[#e2e2e210]"
          onClick={() => setConfiguring(true)}
          aria-label="Configure card"
        >
          <IconSettings size={14} />
        </button>
      </div>

      <div className="flex items-end justify-between gap-4 mt-2">
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

      <div className={`mt-3 flex items-center gap-1.5 text-sm font-medium ${
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
  )
}
