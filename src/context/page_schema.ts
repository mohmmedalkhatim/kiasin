import { arrayMove } from '@dnd-kit/sortable'
import { create } from 'zustand'
interface Card {
  id: number
  props: any
  content: string
  width: number
  height: number
}
export interface Layout {
  list?: Card[]
  sort_list?: string[]
  tauri: String
  init: (str: string) => void
  updateCard: (tauri: string, card: Card) => void
  move: (tauri: string, active_id: Card, over_id: Card) => void
}

export let useLayout = create<Layout>(set => ({
  list: [],
  sort_list: [],
  tauri: '',
  init: (tauri: string) => {
    let list: Card[] = JSON.parse(tauri).items
    let sort_list = list.map(item => item.id.toString())
    set({ list, sort_list, tauri })
  },
  updateCard: (tauri, card) => {
    let list: Card[] = JSON.parse(tauri).items
    let newlist = list.map(item => {
      if (item.id == card.id) {
        item = card
      }
      return item
    })
    set({ list: newlist })
  },
  move: (tauri, active, over) => {
    let list: Card[] = JSON.parse(tauri).items
    if (active !== over) {
      if (list) {
        const oldIndex = list.indexOf(active)
        const newIndex = list.indexOf(over)
        list = arrayMove(list, oldIndex, newIndex)
      }
    }
    let json = { item: list }
    tauri = JSON.stringify(json)
    let sort_list = list.map(item => item.id.toString())
    set({ list, sort_list, tauri })
  }
}))
