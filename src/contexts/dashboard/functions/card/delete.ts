import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { Dashboard, dashboards_storage } from '../..'
import { Channel, invoke } from '@tauri-apps/api/core'

export let delete_card = createAsyncThunk(
  'dashboard/delete_card',
  async (payload: { id: number }, api) => {
    let { id } = payload
    let state = api.getState() as { dashboard: dashboards_storage }
    let dashboard = structuredClone(state.dashboard.active.dashboard)

    let filtered_cards = dashboard.structure.cards
      .filter((_, index) => index !== id)
      .map((card, index) => ({ ...card, id: index }))

    dashboard.structure = { ...dashboard.structure, cards: filtered_cards }

    try {
      let channel = new Channel<Dashboard[]>(() => {})
      await invoke('areas_control', {
        payload: { command: 'update', item: dashboard },
        channel
      })
    } catch (err) {
      return api.rejectWithValue('Failed to delete card: ' + err)
    }

    return dashboard
  }
)

export let delete_card_builder = (
  builder: ActionReducerMapBuilder<dashboards_storage>
) => {
  builder.addAsyncThunk(delete_card, {
    pending: state => {
      state.status = 'loading'
    },
    fulfilled: (state, action) => {
      state.active.dashboard = action.payload
      state.status = 'idle'
    },
    rejected: state => {
      state.status = 'failed'
      state.error = 'Failed to delete the card.'
    }
  })
}
