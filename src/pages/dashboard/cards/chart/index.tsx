import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../contexts/store'
import { useSheetData } from '../useSheetData'
import { useSheetNames } from '../useSheetNames'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Select } from '../../../../components/select'
import { update_card } from '../../../../contexts/dashboard/functions/card/update'
import { IconChartBar, IconSettings } from '@tabler/icons-react'
import Button from '../../../../components/Button'
import ApexCharts from 'apexcharts'
import { CHART_ACCENT, CHART_COLORS, CHART_GRID, CHART_TICK, CHART_TICK_MUTED } from '../chartTheme'

type ChartType = 'line' | 'bar' | 'pie'

const CHART_TYPES: { label: string; value: string }[] = [
  { label: 'Line', value: 'line' },
  { label: 'Bar', value: 'bar' },
  { label: 'Pie', value: 'pie' },
]

export default function ChartCard({ id }: { id: number }) {
  const dispatch = useDispatch<AppDispatch>()
  const card = useSelector((s: RootState) => s.dashboard.active.dashboard.structure.cards)[id]
  const dashboard = useSelector((s: RootState) => s.dashboard.active.dashboard)
  const linkedSheets = dashboard.structure.sheets ?? []

  const sheetId = card?.store?.sheetId
  const columnName = card?.store?.column
  const chartType = (card?.store?.chartType ?? 'bar') as ChartType
  const { columns, rows, loading } = useSheetData(sheetId)
  const sheetNames = useSheetNames(linkedSheets)

  const [configuring, setConfiguring] = useState(!sheetId || !columnName)
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<ApexCharts | null>(null)

  const updateStore = (patch: Record<string, any>) => {
    dispatch(update_card({
      index: id,
      card: { ...card, store: { ...card.store, ...patch } },
    }))
  }

  const chartData = useMemo(() => {
    if (!columnName || rows.length === 0) return null
    const colIdx = columns.findIndex(c => c.name === columnName)
    if (colIdx === -1) return null
    const nums = rows.map(r => Number(r[colIdx])).filter(n => !Number.isNaN(n))
    if (nums.length === 0) return null

    const labels = rows.map((_, i) => String(i + 1))
    return { values: nums, labels }
  }, [rows, columns, columnName])

  useEffect(() => {
    if (!chartRef.current || !chartData || configuring) return

    const colors = chartType === 'pie' ? CHART_COLORS : [CHART_ACCENT]
    const fontFamily = 'inherit'

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: chartType === 'pie' ? 'donut' : chartType,
        height: '100%',
        background: 'transparent',
        toolbar: { show: false },
        animations: {
          enabled: true,
          speed: 400,
        },
        fontFamily,
      },
      theme: { mode: 'dark' },
      colors,
      grid: {
        borderColor: CHART_GRID,
        strokeDashArray: 3,
        padding: { left: 8, right: 8 },
      },
      stroke: chartType === 'line' ? { width: 2, curve: 'smooth' } : { width: 0 },
      fill: chartType === 'line' ? {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 100] },
      } : undefined,
      dataLabels: { enabled: chartType === 'pie' },
      xaxis: {
        categories: chartData.labels,
        labels: { style: { colors: CHART_TICK_MUTED, fontSize: '10px', fontFamily } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: { style: { colors: CHART_TICK_MUTED, fontSize: '10px', fontFamily } },
      },
      tooltip: {
        theme: 'dark',
        y: { formatter: (val: number) => val.toLocaleString() },
      },
      legend: { show: chartType === 'pie', position: 'bottom', labels: { colors: CHART_TICK } },
      ...(chartType === 'pie'
        ? {
            series: chartData.values,
            labels: chartData.labels,
          }
        : {
            series: [{ name: columnName, data: chartData.values }],
          }),
    }

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const chart = new ApexCharts(chartRef.current, options)
    chart.render()
    chartInstance.current = chart

    return () => {
      chart.destroy()
      chartInstance.current = null
    }
  }, [chartData, chartType, configuring, columnName])

  if (configuring || !sheetId || !columnName) {
    return (
      <div className="p-4 flex flex-col gap-3 h-full">
        <div className="flex items-center gap-2 text-sm font-medium text-support-300">
          <IconChartBar size={16} />
          Chart
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
              <>
                <Select
                  placeholder="Select column"
                  value={columnName}
                  options={columns.map(c => ({ label: c.name, value: c.name }))}
                  onChange={(val) => updateStore({ column: val })}
                />
                <Select
                  placeholder="Chart type"
                  value={chartType}
                  options={CHART_TYPES}
                  onChange={(val) => updateStore({ chartType: val })}
                />
                {columnName && (
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

  return (
    <div className="flex flex-col h-full group/card">
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-xs font-medium text-support-500 uppercase tracking-wide truncate">
          {card.store.label || columnName}
        </span>
        <button
          className="p-1 rounded text-support-600 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150 hover:text-support-300 hover:bg-hover-main"
          onClick={() => setConfiguring(true)}
          aria-label="Configure chart"
        >
          <IconSettings size={14} />
        </button>
      </div>
      <div ref={chartRef} className="flex-1 min-h-0 px-1 pb-1" />
    </div>
  )
}
