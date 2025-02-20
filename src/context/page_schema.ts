import { arrayMove } from '@dnd-kit/sortable'
import { create } from 'zustand'
export interface Card {
  id: number
  props: any
  content: string
  rows: number
  cols: number
}
export interface Layout {
  list?: Card[]
  sort_list?: string[]
  tauri: {item:Card[]}
  init: (str: {item:Card[]}) => void
  updateCard: (tauri: {item:Card[]}, card: Card) => void
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
  tauri: {item:[]},
  init: (tauri: {item:Card[]}) => {
    let list: Card[] = tauri.item
    console.log('run init')
    let sort_list = list.map(item => item.id.toString())
    set({ list, sort_list, tauri })
  },
  updateCard: (tauri, card) => {
    let list: Card[] = tauri.item
    let newlist = list.map(item => {
      if (item.id == card.id) {
        item = card
      }
      return item
    })
    tauri = { item: newlist }
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
