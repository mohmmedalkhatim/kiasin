import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { dashboards_storage, Card, CardStore } from '../..'
import { update } from '../update'

let create_card_state = ({
  id,
  type,
  columns = 1,
  rows = 1,
  store,
}: {
  id: number
  type: Card['type']
  columns?: number
  rows?: number
  store?: Partial<CardStore>
}): Card => {
  return {
    id,
    type,
    store: { list: [], ...store },
    size: {
      columns,
      rows
    }
  }
}
export let create_card = createAsyncThunk(
  'dashboard/create_card',
  (
    {
      type,
      columns = 1,
      rows = 1,
      store,
    }: { type: Card['type']; columns?: number; rows?: number; store?: Partial<CardStore> },
    api
  ) => {
    let { dashboard } = api.getState() as { dashboard: dashboards_storage }
    let { structure } = dashboard.active.dashboard
    let card = create_card_state({
      id: structure.cards.length,
      type,
      columns,
      rows,
      store,
    })
    api.dispatch(
      update({
        ...dashboard.active.dashboard,
        structure: { ...structure, cards: [...structure.cards, card] }
      })
    )
    return card
  }
)

export let create_card_thunk_builder = (
  builder: ActionReducerMapBuilder<dashboards_storage>
) => {
  builder.addAsyncThunk(create_card, {
    pending: state => {
      state.status = 'loading'
      state.loading = true
    },
    fulfilled: (state, action) => {
      state.status = 'succeeded'
      state.loading = false
      state.active.dashboard.structure.cards.push(action.payload)
    },
    rejected: state => {
      state.status = 'failed'
      state.loading = false
      state.error = 'There was an error creating the dashboard.'
    }
  })
}
