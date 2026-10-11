import { useState } from 'react'
import { useAsync } from 'react-use'
import { Channel, invoke } from '@tauri-apps/api/core'
import { Sheet } from '../../../contexts/sheets/objects'
import * as exceljs from 'exceljs'

function colLetterToIndex(letters: string): number {
  let n = 0
  for (const ch of letters.toUpperCase()) {
    n = n * 26 + (ch.charCodeAt(0) - 64)
  }
  return n
}

export interface SheetData {
  columns: { name: string }[]
  rows: any[][]
  sheet: Sheet | null
}

export function useSheetData(sheetId: number | undefined): SheetData & { loading: boolean } {
  const [data, setData] = useState<SheetData>({ columns: [], rows: [], sheet: null })
  const [loading, setLoading] = useState(true)

  useAsync(async () => {
    if (!sheetId) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const sheet = await new Promise<Sheet | null>((resolve) => {
        const channel = new Channel<Sheet[]>((res) => {
          resolve(res[0] ?? null)
        })
        invoke('sheets_control', { payload: { command: 'retrieve', id: sheetId }, channel })
      })

      if (!sheet) {
        setData({ columns: [], rows: [], sheet: null })
        setLoading(false)
        return
      }

      if (!sheet.file || !sheet.name) {
        setData({ columns: [], rows: [], sheet })
        setLoading(false)
        return
      }

      const workbook = new exceljs.Workbook()
      // @ts-ignore
      const ws = (await workbook.xlsx.load(sheet.file)).worksheets[0]
      const tableObj = ws.getTable(sheet.name)
      // @ts-ignore
      const tableDef = tableObj.table as exceljs.Table
      const numCols = tableDef.columns.length
       
      const refMatch = (tableDef.ref ?? 'A1').match(/([A-Z]+)(\d+)/i)
      const startCol = refMatch ? colLetterToIndex(refMatch[1]) : 1
      const headerRow = refMatch ? parseInt(refMatch[2]) : 1
      const dataStartRow = headerRow + 1

      const rows: any[][] = []
      ws.eachRow((row, rowNumber) => {
        if (rowNumber < dataStartRow) return
        const cells: any[] = []
        for (let i = 0; i < numCols; i++) {
          cells.push(row.getCell(startCol + i).value)
        }
        if (cells.some((c) => c !== null && c !== undefined)) {
          rows.push(cells)
        }
      })

      setData({
        columns: tableDef.columns.map((c) => ({ name: c.name })),
        rows,
        sheet,
      })
    } catch (err) {
      console.error('Failed to load sheet data:', err)
      setData({ columns: [], rows: [], sheet: null })
    }
    setLoading(false)
  }, [sheetId])

  return { ...data, loading }
}
