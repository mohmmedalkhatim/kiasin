import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../contexts/store'
import { useSheetData } from '../useSheetData'
import { useSheetNames } from '../useSheetNames'
import { useMemo, useState } from 'react'
import { Select } from '../../../../components/select'
import { update_card } from '../../../../contexts/area/functions/card/update'
import { IconChartPie, IconSettings } from '@tabler/icons-react'
import { Dialog } from '../../../../components/Dialog'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip)

const COLORS = ['#6366f1', '#3b82f6', '#22d3ee', '#a78bfa', '#f472b6', '#f59e0b']

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

  const [dialogOpen, setDialogOpen] = useState(false)
  const configured = sheetId && labelCol && valueCol

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

  const configDialog = (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Configure Donut Chart" widthClass="w-80">
      <div className="flex flex-col gap-3 px-6">
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
                <Select placeholder="Label column" value={labelCol} options={columns.map(c => ({ label: c.name, value: c.name }))} onChange={(val) => updateStore({ column: val })} />
                <Select placeholder="Value column" value={valueCol} options={columns.filter(c => c.name !== labelCol).map(c => ({ label: c.name, value: c.name }))} onChange={(val) => updateStore({ columnB: val })} />
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
        <IconChartPie size={24} className="text-support-600" />
        <p className="text-xs text-support-500">No chart configured</p>
        <button className="text-xs text-primary-400 hover:text-primary-300 rounded focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none" onClick={() => setDialogOpen(true)}>Configure</button>
      </div>
    )
  }

  if (!chartData) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center gap-2">
        {configDialog}
        <p className="text-sm text-support-500">No numeric data</p>
        <button className="text-xs text-primary-400 hover:text-primary-300 rounded focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none" onClick={() => setDialogOpen(true)}>Reconfigure</button>
      </div>
    )
  }

  const data = {
    labels: chartData.map(d => d.label),
    datasets: [{
      data: chartData.map(d => d.value),
      backgroundColor: chartData.map((_, i) => COLORS[i % COLORS.length]),
      borderWidth: 0,
      spacing: 2,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.95)',
        titleColor: '#e2e8f0',
        bodyColor: '#f8fafc',
        titleFont: { size: 11, weight: 'normal' as const },
        bodyFont: { size: 12, weight: 'bold' as const },
        padding: { top: 8, bottom: 8, left: 12, right: 12 },
        cornerRadius: 6,
        borderColor: 'rgba(148,163,184,0.15)',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: (ctx: any) => {
            const item = chartData[ctx.dataIndex]
            return ` ${item.label}: ${item.pct.toFixed(0)}%`
          },
        },
      },
    },
  }

  return (
    <div className="flex flex-col h-full @container">
      {configDialog}
      {sheetId && <p className="text-[10px] text-support-600 px-4 pt-2 truncate">{sheetNames.get(sheetId) ?? `Sheet #${sheetId}`}</p>}
      <div className="flex items-center justify-between px-4 pt-1 pb-1 relative z-0">
        <span className="text-xs font-medium text-support-500 uppercase tracking-wide truncate">
          {card.store.label || valueCol}
        </span>
        <button
          className="p-2 rounded text-support-600 hover:text-support-300 hover:bg-hover-main focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          onClick={() => setDialogOpen(true)}
          aria-label="Configure chart"
        >
          <IconSettings size={14} />
        </button>
      </div>
      <div className={`flex-1 min-h-0 flex items-center justify-center overflow-hidden ${card.size.rows >= 2 ? 'p-4 @[20rem]:p-6' : 'px-3 @[14rem]:px-4 py-2'}`}>
        <div className="aspect-square h-full max-h-full" role="img" aria-label={`${card.store.label || valueCol} donut chart`}>
          <Doughnut data={data} options={{ ...options, maintainAspectRatio: true }} />
        </div>
      </div>
      <div className="shrink-0 flex flex-wrap gap-x-3 gap-y-0.5 @[14rem]:gap-y-1 px-3 @[14rem]:px-4 pb-2 justify-center overflow-hidden">
        {chartData.map((d, i) => (
          <div key={i} className="flex items-center gap-1 @[14rem]:gap-1.5 text-[10px] @[14rem]:text-xs text-support-400">
            <span className="w-1.5 h-1.5 @[14rem]:w-2 @[14rem]:h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="truncate">{d.label}</span>
            <span className="text-support-200 font-bold tabular-nums">{d.pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
