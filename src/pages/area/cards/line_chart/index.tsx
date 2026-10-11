import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../contexts/store'
import { useSheetData } from '../useSheetData'
import { useSheetNames } from '../useSheetNames'
import { useMemo, useState } from 'react'
import { Select } from '../../../../components/select'
import { update_card } from '../../../../contexts/area/functions/card/update'
import { IconTrendingUp, IconSettings } from '@tabler/icons-react'
import Button from '../../../../components/Button'

function formatAxis(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(0) + 'M'
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(0) + 'k'
  return String(Math.round(n))
}

export default function LineChartCard({ id }: { id: number }) {
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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

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
      .map(r => ({ label: String(r[labelIdx]), value: Number(r[valueIdx]) }))
      .filter(d => !Number.isNaN(d.value))
    if (items.length === 0) return null
    return items
  }, [rows, columns, labelCol, valueCol])

  if (configuring || !sheetId || !labelCol || !valueCol) {
    return (
      <div className="p-4 flex flex-col gap-3 h-full">
        <div className="flex items-center gap-2 text-sm font-medium text-support-300">
          <IconTrendingUp size={16} />
          Line Chart
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

  const maxVal = Math.max(...chartData.map(d => d.value))
  const minVal = Math.min(...chartData.map(d => d.value))
  const range = maxVal - minVal || 1
  const gridSteps = 4
  const svgW = 520
  const svgH = 250
  const left = 48
  const right = 500
  const top = 34
  const bottom = 184
  const labelY = 216
  const chartW = right - left
  const chartH = bottom - top

  const points = chartData.map((d, i) => {
    const x = left + (chartW / Math.max(chartData.length - 1, 1)) * i
    const y = top + chartH * (1 - (d.value - minVal) / range)
    return { x, y, ...d }
  })

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ')

  const gridValues = Array.from({ length: gridSteps }, (_, i) =>
    maxVal - (range * i) / (gridSteps - 1)
  )

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
      <div className="relative flex-1 min-h-0 px-3 pb-2">
        {hoveredIdx !== null && (
          <div
            className="absolute z-10 px-2.5 py-1.5 rounded-lg bg-[#10233f] text-white text-xs font-bold shadow-lg pointer-events-none"
            style={{
              left: points[hoveredIdx].x,
              top: Math.max(4, points[hoveredIdx].y - 36),
              transform: 'translateX(-50%)',
            }}
          >
            {points[hoveredIdx].label} — {points[hoveredIdx].value.toLocaleString()}
          </div>
        )}
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full" style={{ overflow: 'visible' }}>
          {gridValues.map((v, i) => {
            const y = top + (chartH / (gridSteps - 1)) * i
            return (
              <g key={i}>
                <line x1={left} y1={y} x2={right} y2={y} stroke="#e2e2e215" strokeWidth={1} />
                <text x={10} y={y + 4} fill="#718096" fontSize={11} fontFamily="inherit">{formatAxis(v)}</text>
              </g>
            )
          })}
          <polyline
            points={polyline}
            fill="none" stroke="#2563eb" strokeWidth={4}
            strokeLinecap="round" strokeLinejoin="round"
          />
          {points.map((p, i) => (
            <circle
              key={i} cx={p.x} cy={p.y} r={6}
              fill={hoveredIdx === i ? '#c7f36a' : '#fff'}
              stroke={hoveredIdx === i ? '#10233f' : '#2563eb'}
              strokeWidth={3}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
          {points.map((p, i) => (
            <text
              key={`l${i}`} x={p.x} y={labelY}
              textAnchor="middle" fill="#52627a" fontSize={11} fontWeight={700} fontFamily="inherit"
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>
      <div className="flex flex-wrap gap-3 px-4 pb-3 mt-auto">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-support-500">
          <span className="w-5 h-[3px] rounded-full bg-[#2563eb]" />
          {valueCol}
        </span>
      </div>
    </div>
  )
}
