import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../contexts/store'
import { useSheetData } from '../useSheetData'
import { useSheetNames } from '../useSheetNames'
import { useMemo, useState } from 'react'
import { Select } from '../../../../components/select'
import { update_card } from '../../../../contexts/dashboard/functions/card/update'
import { IconChartBar, IconSettings } from '@tabler/icons-react'
import { Dialog } from '../../../../components/Dialog'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'
import { CHART_COLORS, CHART_GRID, CHART_TICK, CHART_TICK_MUTED, CHART_TOOLTIP, withAlpha } from '../chartTheme'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

export default function BarChartCard({ id }: { id: number }) {
  const dispatch = useDispatch<AppDispatch>()
  const card = useSelector((s: RootState) => s.dashboard.active.dashboard.structure.cards)[id]
  const dashboard = useSelector((s: RootState) => s.dashboard.active.dashboard)
  const linkedSheets = dashboard.structure.sheets ?? []

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
      .map(r => ({ label: String(r[labelIdx]), value: Number(r[valueIdx]) }))
      .filter(d => !Number.isNaN(d.value))
    return items.length === 0 ? null : items
  }, [rows, columns, labelCol, valueCol])

  const configDialog = (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Configure Bar Chart" widthClass="w-80">
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
        <IconChartBar size={24} className="text-support-600" />
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
      backgroundColor: chartData.map((_, i) => withAlpha(CHART_COLORS[i % CHART_COLORS.length], 0.8)),
      hoverBackgroundColor: chartData.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
      borderRadius: 6,
      borderSkipped: false as const,
      maxBarThickness: 48,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 8, bottom: 4, left: 0, right: 8 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...CHART_TOOLTIP,
        displayColors: false,
        callbacks: {
          title: (items: any[]) => items[0]?.label ?? '',
          label: (ctx: any) => ctx.parsed.y.toLocaleString(),
        },
      },
    },
    scales: {
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: { color: CHART_TICK, font: { size: 11 }, padding: 8 },
      },
      y: {
        border: { display: false },
        grid: { color: CHART_GRID, lineWidth: 1 },
        ticks: {
          color: CHART_TICK_MUTED,
          font: { size: 10 },
          padding: 8,
          maxTicksLimit: 5,
          callback: (v: number | string) => {
            const n = Number(v)
            if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
            if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'k'
            return String(Math.round(n))
          },
        },
      },
    },
  }

  return (
    <div className="flex flex-col h-full">
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
      <div className="relative flex-1 min-h-0 px-3 pb-3 z-0">
        <div className="absolute inset-0 px-3 pb-3" role="img" aria-label={`${card.store.label || valueCol} bar chart`}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  )
}
