import { arrayMove } from '@dnd-kit/sortable'
import { create } from 'zustand'
interface Card {
  id: number
  props: any
  content: string
  rows: number
  cols: number
}
export interface Layout {
  list?: Card[]
  sort_list?: string[]
  tauri: string
  init: (str: string) => void
  updateCard: (tauri: string, card: Card) => void
  updateSort: (
    sort_list: string[] | undefined,
    active: any,
    over: any,
    list: Card[] | undefined
  ) => void
}

export let useLayout = create<Layout>(set => ({
  list: [],
  sort_list: [],
  tauri: '',
  init: (tauri: string) => {
    let list: Card[] = JSON.parse(tauri).items
    console.log('run init')
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
    tauri = JSON.stringify({ items: newlist })
    set({ list: newlist, tauri })
  },
  updateSort: (sort_list, active, over, newlist) => {
    if (sort_list && newlist && active.id !== over.id) {
      const oldIndex = sort_list.indexOf(active.id)
      const newIndex = sort_list.indexOf(over.id)
      let list = arrayMove(newlist, oldIndex, newIndex)
      set({
        list,
        sort_list: list.map(item => item.id.toString())
      })
    }
  }
}))
