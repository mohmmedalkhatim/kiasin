import { useState } from 'react'
import { useAsync } from 'react-use'
import { Channel, invoke } from '@tauri-apps/api/core'
import { Sheet } from '../../../contexts/sheets/objects'

export function useSheetNames(sheetIds: number[]): Map<number, string> {
  const [names, setNames] = useState<Map<number, string>>(new Map())

  useAsync(async () => {
    if (sheetIds.length === 0) return
    try {
      const channel = new Channel<Sheet[]>((res) => {
        const map = new Map<number, string>()
        for (const s of res) {
          if (s.id != null) map.set(s.id, s.name)
        }
        setNames(map)
      })
      await invoke('sheets_control', { payload: { command: 'list' }, channel })
    } catch {
      // ignore
    }
  }, [sheetIds.join(',')])

  return names
}
