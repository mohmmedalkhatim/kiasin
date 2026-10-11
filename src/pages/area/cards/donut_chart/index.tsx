import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../contexts/store'
import { useSheetData } from '../useSheetData'
import { useSheetNames } from '../useSheetNames'
import { useMemo, useState } from 'react'
import { Select } from '../../../../components/select'
import { update_card } from '../../../../contexts/area/functions/card/update'
import { IconChartPie, IconSettings } from '@tabler/icons-react'
import Button from '../../../../components/Button'

const COLORS = ['#2563eb', '#c7f36a', '#94a3b8', '#f59e0b', '#ef4444', '#8b5cf6']

export default function DonutChartCard({ id }: { id: number }) {
  const dispatch = useDispatch<AppDispatch>()
  const card = useSelector((s: RootState) => s.area.active.area.structure.cards)[id]
  const area = useSelector((s: RootState) => s.area.active.area)
  const linkedSheets = area.structure.sheets ?? []

  const sheetId = card?.store?.sheetId
  const labelCol = card?.store?.column
  const valueCol = card?.store?.columnB
  const { columns, rows, loading } = useSheetData(sheetId)
  const sheetNames = useSheetNames(linkedSheets)

  const [configuring, setConfiguring] = useState(!sheetId || !labelCol || !valueCol)

  const updateStore = (patch: Record<string, any>) => {
    dispatch(update_card({
      index: id,
      card: { ...card, store: { ...card.store, ...patch } },
    }))
  }

  const chartData = useMemo(() => {
    if (!labelCol || !valueCol || rows.length === 0) return null
    const labelIdx = columns.findIndex(c => c.name === labelCol)
    const valueIdx = columns.findIndex(c => c.name === valueCol)
    if (labelIdx === -1 || valueIdx === -1) return null

    const items = rows
      .map(r => ({ label: String(r[labelIdx]), value: Math.abs(Number(r[valueIdx])) }))
      .filter(d => !Number.isNaN(d.value) && d.value > 0)
    if (items.length === 0) return null

    const total = items.reduce((a, b) => a + b.value, 0)
    return items.map(d => ({ ...d, pct: (d.value / total) * 100 }))
  }, [rows, columns, labelCol, valueCol])

  if (configuring || !sheetId || !labelCol || !valueCol) {
    return (
      <div className="p-4 flex flex-col gap-3 h-full">
        <div className="flex items-center gap-2 text-sm font-medium text-support-300">
          <IconChartPie size={16} />
          Donut Chart
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
                  placeholder="Label column"
                  value={labelCol}
                  options={columns.map(c => ({ label: c.name, value: c.name }))}
                  onChange={(val) => updateStore({ column: val })}
                />
                <Select
                  placeholder="Value column"
                  value={valueCol}
                  options={columns.filter(c => c.name !== labelCol).map(c => ({ label: c.name, value: c.name }))}
                  onChange={(val) => updateStore({ columnB: val })}
                />
                {valueCol && (
                  <Button size="xs" variant="tonal" className="w-full" onClick={() => setConfiguring(false)}>
                    Show chart
                  </Button>
                )}
              </>
            )}
            {loading && <p className="text-xs text-support-500">Loading…</p>}
          </>
        )}
      </div>
    )
  }

  if (!chartData) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center gap-2">
        <p className="text-sm text-support-500">No numeric data</p>
        <button className="text-xs text-primary-400 hover:text-primary-300" onClick={() => setConfiguring(true)}>
          Reconfigure
        </button>
      </div>
    )
  }

  const r = 43
  const circumference = 2 * Math.PI * r
  let offset = 0
  const segments = chartData.map((d, i) => {
    const dashLen = (d.pct / 100) * circumference
    const seg = { dashLen, offset: -offset, color: COLORS[i % COLORS.length], ...d }
    offset += dashLen + 1.5
    return seg
  })

  return (
    <div className="flex flex-col h-full group/card">
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-xs font-medium text-support-500 uppercase tracking-wide truncate">
          {card.store.label || valueCol}
        </span>
        <button
          className="p-1 rounded text-support-600 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150 hover:text-support-300 hover:bg-[#e2e2e210]"
          onClick={() => setConfiguring(true)}
          aria-label="Configure chart"
        >
          <IconSettings size={14} />
        </button>
      </div>
      <div className="flex-1 min-h-0 px-4 pb-2 grid grid-cols-[minmax(100px,0.9fr)_minmax(100px,1.1fr)] items-center gap-4">
        <div className="relative aspect-square w-full max-w-[180px] mx-auto grid place-items-center">
          <svg viewBox="0 0 120 120" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={60} cy={60} r={r} fill="none" stroke="#e2e2e215" strokeWidth={18} />
            {segments.map((s, i) => (
              <circle
                key={i} cx={60} cy={60} r={r}
                fill="none" stroke={s.color} strokeWidth={18}
                strokeDasharray={`${s.dashLen} ${circumference}`}
                strokeDashoffset={s.offset}
              />
            ))}
          </svg>
          <div className="absolute text-center">
            <strong className="block text-2xl font-semibold text-support-100 tabular-nums leading-none">100%</strong>
            <span className="text-[10px] text-support-500 uppercase font-bold">total</span>
          </div>
        </div>
        <div className="grid gap-3">
          {chartData.map((d, i) => (
            <div key={i} className="flex items-center justify-between gap-2 text-sm text-support-400">
              <span className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {d.label}
              </span>
              <span className="text-support-200 font-bold tabular-nums">{d.pct.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
