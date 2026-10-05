import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../../store'
import { Area, areas_storage } from '../..'
import { Channel, invoke } from '@tauri-apps/api/core'

export let delete_card = createAsyncThunk(
  'area/delete_card',
  async (payload: { id: number }, api) => {
    let { id } = payload
    let state = api.getState() as RootState
    let area = structuredClone(state.area.active.area)

    let filtered_cards = area.structure.cards
      .filter((_, index) => index !== id)
      .map((card, index) => ({ ...card, id: index }))

    area.structure = { ...area.structure, cards: filtered_cards }

    try {
      let channel = new Channel<Area[]>(() => {})
      await invoke('areas_control', {
        payload: { command: 'update', item: area },
        channel
      })
    } catch (err) {
      return api.rejectWithValue('Failed to delete card: ' + err)
    }

    return area
  }
)

export let delete_card_builder = (
  builder: ActionReducerMapBuilder<areas_storage>
) => {
  builder.addAsyncThunk(delete_card, {
    pending: state => {
      state.status = 'loading'
    },
    fulfilled: (state, action) => {
      state.active.area = action.payload
      state.status = 'idle'
    },
    rejected: state => {
      state.status = 'failed'
      state.error = 'Failed to delete the card.'
    }
  })
}
