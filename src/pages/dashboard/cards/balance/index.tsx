import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../contexts/store'
import { useSheetData } from '../useSheetData'
import { useSheetNames } from '../useSheetNames'
import { useMemo, useState } from 'react'
import { Select } from '../../../../components/select'
import { update_card } from '../../../../contexts/dashboard/functions/card/update'
import { IconSettings, IconTrendingUp, IconTrendingDown, IconWallet } from '@tabler/icons-react'
import { Dialog } from '../../../../components/Dialog'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'
import { CHART_ACCENT, CHART_GRID, CHART_POINT, CHART_TICK_MUTED, CHART_TOOLTIP, withAlpha } from '../chartTheme'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

function formatCurrency(n: number): string {
  if (Math.abs(n) >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M'
  if (Math.abs(n) >= 1_000) return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return '$' + n.toFixed(2)
}

function formatCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'k'
  return String(Math.round(n))
}

export default function BalanceCard({ id }: { id: number }) {
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

  const stats = useMemo(() => {
    if (!chartData || chartData.length === 0) return null
    const values = chartData.map(d => d.value)
    const current = values[values.length - 1]
    const first = values[0]
    const high = Math.max(...values)
    const low = Math.min(...values)
    const change = first !== 0 ? ((current - first) / Math.abs(first)) * 100 : 0
    const todayValue = values.length >= 2 ? values[values.length - 1] : current
    const yesterdayValue = values.length >= 2 ? values[values.length - 2] : current
    const todayChange = yesterdayValue !== 0 ? ((todayValue - yesterdayValue) / Math.abs(yesterdayValue)) * 100 : 0
    return { current, high, low, change, todayValue, todayChange }
  }, [chartData])

  const configDialog = (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Configure Balance Card" widthClass="w-80">
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
                <Select placeholder="Label column (dates)" value={labelCol} options={columns.map(c => ({ label: c.name, value: c.name }))} onChange={(val) => updateStore({ column: val })} />
                <Select placeholder="Value column (amounts)" value={valueCol} options={columns.filter(c => c.name !== labelCol).map(c => ({ label: c.name, value: c.name }))} onChange={(val) => updateStore({ columnB: val })} />
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
        <IconWallet size={24} className="text-support-600" />
        <p className="text-xs text-support-500">No balance card configured</p>
        <button
          className="text-xs text-primary-400 hover:text-primary-300 rounded focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          onClick={() => setDialogOpen(true)}
        >
          Configure
        </button>
      </div>
    )
  }

  if (!chartData || !stats) {
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

  const isPositive = stats.change >= 0
  const isTodayPositive = stats.todayChange >= 0

  const data = {
    labels: chartData.map(d => d.label),
    datasets: [{
      label: valueCol,
      data: chartData.map(d => d.value),
      fill: true,
      borderColor: CHART_ACCENT,
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart
        const { ctx: canvasCtx, chartArea } = chart
        if (!chartArea) return withAlpha(CHART_ACCENT, 0.08)
        const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, withAlpha(CHART_ACCENT, 0.10))
        gradient.addColorStop(1, withAlpha(CHART_ACCENT, 0))
        return gradient
      },
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: CHART_POINT,
      pointHoverBorderColor: CHART_ACCENT,
      pointHoverBorderWidth: 2,
      tension: 0.35,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' as const },
    layout: { padding: { top: 4, bottom: 0, left: 0, right: 0 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...CHART_TOOLTIP,
        displayColors: false,
        callbacks: {
          label: (ctx: any) => formatCurrency(ctx.parsed.y),
        },
      },
    },
    scales: {
      x: {
        display: true,
        border: { display: false },
        grid: { display: false },
        ticks: {
          color: CHART_TICK_MUTED,
          font: { size: 10 },
          padding: 4,
          maxTicksLimit: 8,
        },
      },
      y: {
        display: true,
        border: { display: false },
        grid: {
          color: CHART_GRID,
          lineWidth: 1,
        },
        ticks: {
          color: CHART_TICK_MUTED,
          font: { size: 10 },
          padding: 8,
          maxTicksLimit: 5,
          callback: (v: number | string) => '$' + formatCompact(Number(v)),
        },
      },
    },
  }

  return (
    <div className="flex flex-col h-full group/card">
      {configDialog}

      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between mb-1">
          {sheetId && (
            <p className="text-[10px] text-support-600 truncate">
              {sheetNames.get(sheetId) ?? `Sheet #${sheetId}`}
            </p>
          )}
          <button
            className="p-2 rounded text-support-600 opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 hover:text-support-300 hover:bg-hover-main focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
            onClick={() => setDialogOpen(true)}
            aria-label="Configure card"
          >
            <IconSettings size={14} />
          </button>
        </div>

        <p className="text-xs text-support-500 font-medium mb-0.5">
          {card.store.label || 'Current Balance'}
        </p>
        <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-3">
          <span className="text-2xl font-bold text-support-100 tabular-nums">
            {formatCurrency(stats.current)}
          </span>
          <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-success-400' : 'text-danger-400'}`}>
            {isPositive ? <IconTrendingUp size={14} /> : <IconTrendingDown size={14} />}
            <span className="font-medium">{isPositive ? '+' : ''}{stats.change.toFixed(1)}%</span>
            <span className="text-support-500 font-normal">overall</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 text-xs px-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-support-500">Latest:</span>
          <span className="font-semibold text-support-200 tabular-nums">{formatCurrency(stats.todayValue)}</span>
          <span className={`${isTodayPositive ? 'text-success-400' : 'text-danger-400'}`}>
            ({isTodayPositive ? '+' : ''}{stats.todayChange.toFixed(1)}%)
          </span>
        </div>
        <div className="flex items-center gap-4 text-support-500">
          <span>High: <span className="text-primary-300 font-medium tabular-nums">{formatCurrency(stats.high)}</span></span>
          <span>Low: <span className="text-warning-400 font-medium tabular-nums">{formatCurrency(stats.low)}</span></span>
        </div>
      </div>

      <div className="relative flex-1 min-h-0 px-2 pb-2 z-0">
        <div
          className="absolute inset-0 px-2 pb-2"
          role="img"
          aria-label={`${card.store.label || 'Balance'} line chart with ${chartData.length} data points`}
        >
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  )
}
