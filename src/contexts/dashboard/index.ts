import { createSlice } from '@reduxjs/toolkit'
import { create_thunk_builder } from './functions/create'
import { update_thunk_builder } from './functions/update'
import { retrieve_thunk_builder } from './functions/retrieve'
import { delete_thunk_builder } from './functions/delete'
import { list_thunk_builder } from './functions/list'
import { create_card_thunk_builder } from './functions/card/create'
import { delete_card_builder } from './functions/card/delete'
import { update_card_builder } from './functions/card/update'

export interface CardStore {
  list: undefined | number[]
  sheetId?: number
  sheetIdB?: number
  column?: string
  columnB?: string
  chartType?: 'line' | 'bar' | 'pie'
  label?: string
  labelB?: string
  aggregation?: 'sum' | 'average' | 'count' | 'latest' | 'min' | 'max'
  limit?: number
  prefix?: string
  suffix?: string
  todos?: { id: string; text: string; done: boolean }[]
  formId?: string
}

export interface Card {
  id: number
  type: 'dashboards' | 'value' | 'form' | 'summary' | 'chart' | 'comparison' | 'bar_chart' | 'line_chart' | 'donut_chart' | 'area_chart' | 'balance' | 'revenue' | 'todo' | 'progress'
  store: CardStore
  size: {
    columns: number
    rows: number
  }
}

export interface Dashboard {
  id: number
  name: string
  description: string
  structure: { cards: Card[]; dense: boolean,sheets: number[] }
}
export interface dashboards_storage {
  loading: boolean
  error: string | null
  active: { edit: boolean; dashboard: Dashboard }
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  list: Dashboard[]
}

export let init: dashboards_storage = {
  error: null,
  status: 'idle',
  active: { edit: false, dashboard: {} as Dashboard },
  loading: false,
  list: []
}

export let dashboards = createSlice({
  name: 'dashboard',
  initialState: init,
  reducers: _ => ({
    toggle_editing: state => {
      state.active.edit = !state.active.edit
    },
    update_card_order (state, action) {
      state.active.dashboard.structure.cards = structuredClone(action.payload)
    },
    update_active (state, action) {
      state.active.dashboard = action.payload
    }
  }),
  extraReducers: builder => {
    create_thunk_builder(builder)
    update_thunk_builder(builder)
    create_card_thunk_builder(builder)
    retrieve_thunk_builder(builder)
    delete_thunk_builder(builder)
    list_thunk_builder(builder)
    delete_card_builder(builder)
    update_card_builder(builder)
  }
})

export default dashboards.reducer
