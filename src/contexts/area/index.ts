import { createSlice } from '@reduxjs/toolkit'
import { create_thunk_builder } from './functions/create'
import { update_thunk_builder } from './functions/update'
import { retrieve_thunk_builder } from './functions/retrieve'
import { delete_thunk_builder } from './functions/delete'
import { list_thunk_builder } from './functions/list'
import { create_card_thunk_builder } from './functions/card/create'
import { update_card_builder } from './functions/card/update'

export interface CardStore {
  list: undefined | number[]
  sheetId?: number
  column?: string
  columnB?: string
  chartType?: 'line' | 'bar' | 'pie'
  label?: string
  labelB?: string
}

export interface Card {
  id: number
  type: 'areas' | 'value' | 'form' | 'summary' | 'chart' | 'comparison'
  store: CardStore
  size: {
    columns: number
    rows: number
  }
}

export interface Area {
  id: number
  name: string
  description: string
  structure: { cards: Card[]; dense: boolean,sheets: number[] }
}
export interface areas_storage {
  loading: boolean
  error: string | null
  active: { edit: boolean; area: Area }
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  list: Area[]
}

export let init: areas_storage = {
  error: null,
  status: 'idle',
  active: { edit: false, area: {} as Area },
  loading: false,
  list: []
}

export let areas = createSlice({
  name: 'area',
  initialState: init,
  reducers: _ => ({
    toggle_editing: state => {
      state.active.edit = !state.active.edit
    },
    update_card_order (state, action) {
      state.active.area.structure.cards = structuredClone(action.payload)
    },
    update_active (state, action) {
      state.active.area = action.payload
    }
  }),
  extraReducers: builder => {
    create_thunk_builder(builder)
    update_thunk_builder(builder)
    create_card_thunk_builder(builder)
    retrieve_thunk_builder(builder)
    delete_thunk_builder(builder)
    list_thunk_builder(builder)
    update_card_builder(builder)
  }
})

export default areas.reducer
