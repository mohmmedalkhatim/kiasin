import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../contexts/store'
import { useSheetData } from '../useSheetData'
import { useSheetNames } from '../useSheetNames'
import { useMemo, useState } from 'react'
import { Select } from '../../../../components/select'
import { update_card } from '../../../../contexts/area/functions/card/update'
import { IconSettings, IconSum } from '@tabler/icons-react'

function formatValue(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return Number.isInteger(n) ? String(n) : n.toFixed(2)
}

export default function SummaryCard({ id }: { id: number }) {
  const dispatch = useDispatch<AppDispatch>()
  const card = useSelector((s: RootState) => s.area.active.area.structure.cards)[id]
  const area = useSelector((s: RootState) => s.area.active.area)
  const linkedSheets = area.structure.sheets ?? []

  const sheetId = card?.store?.sheetId
  const columnName = card?.store?.column
  const { columns, rows, sheet, loading } = useSheetData(sheetId)
  const sheetNames = useSheetNames(linkedSheets)

  const [configuring, setConfiguring] = useState(!sheetId || !columnName)

  const stats = useMemo(() => {
    if (!columnName || rows.length === 0) return null
    const colIdx = columns.findIndex(c => c.name === columnName)
    if (colIdx === -1) return null
    const nums = rows.map(r => Number(r[colIdx])).filter(n => !Number.isNaN(n))
    if (nums.length === 0) return null
    const sum = nums.reduce((a, b) => a + b, 0)
    return {
      sum,
      average: sum / nums.length,
      min: Math.min(...nums),
      max: Math.max(...nums),
      count: nums.length,
    }
  }, [rows, columns, columnName])

  const updateStore = (patch: Record<string, any>) => {
    dispatch(update_card({
      index: id,
      card: { ...card, store: { ...card.store, ...patch } },
    }))
  }

  if (configuring || !sheetId || !columnName) {
    return (
      <div className="p-4 flex flex-col gap-3 h-full">
        <div className="flex items-center gap-2 text-sm font-medium text-support-300">
          <IconSum size={16} />
          Summary
        </div>
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
                onChange={(val) => {
                  updateStore({ column: val })
                  setConfiguring(false)
                }}
              />
            )}
            {loading && <p className="text-xs text-support-500">Loading…</p>}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col justify-between h-full group/card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-support-500 uppercase tracking-wide truncate">
          {card.store.label || columnName}
        </span>
        <button
          className="p-1 rounded text-support-600 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150 hover:text-support-300 hover:bg-[#e2e2e210]"
          onClick={() => setConfiguring(true)}
          aria-label="Configure card"
        >
          <IconSettings size={14} />
        </button>
      </div>

      {stats ? (
        <>
          <div className="mt-2">
            <span className="text-2xl font-semibold text-support-100 tabular-nums">
              {formatValue(stats.sum)}
            </span>
            <span className="ml-1.5 text-xs text-support-500">total</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Stat label="Avg" value={formatValue(stats.average)} />
            <Stat label="Min" value={formatValue(stats.min)} />
            <Stat label="Max" value={formatValue(stats.max)} />
          </div>
        </>
      ) : (
        <p className="text-sm text-support-500 mt-2">No numeric data</p>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-support-600 uppercase">{label}</span>
      <span className="text-sm font-medium text-support-200 tabular-nums">{value}</span>
    </div>
  )
}
