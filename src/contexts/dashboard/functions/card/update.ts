import {
  ActionReducerMapBuilder,
  createAsyncThunk
} from '@reduxjs/toolkit'
import { Dashboard, dashboards_storage, Card } from '../..'
import { Channel, invoke } from '@tauri-apps/api/core';

export let update_card = createAsyncThunk(
  'dashboard/update_card',
  (payload: { index: number; card: Card }, api) => {
    let list:Card[] = [];
    try {
      let { index, card } = payload
      let rootState = api.getState() as { dashboard: dashboards_storage }
      let cards = structuredClone(rootState.dashboard.active.dashboard.structure.cards)
      cards[index] = card
      update_dashboard({...rootState.dashboard.active.dashboard,structure:{...rootState.dashboard.active.dashboard.structure,cards:cards}}).then(res=>{console.log(res)}).catch(err=>console.log(err))
      return cards
    } catch (err) {
      console.error(err)
    }
    return list as Card[]
  }
)
let update_dashboard = async (dashboard:Dashboard)=>{
 let res = {} as Dashboard
  try {
    let channel = new Channel<Dashboard[]>(state => {
      res = state[0]
    })
    await invoke('areas_control', {
      payload: { command: 'update', item: dashboard },
      channel
    })
  } catch (err) {
    console.error("there is a problem with database")
  }
  return res
}
export let update_card_builder = (
  builder: ActionReducerMapBuilder<dashboards_storage>
) => {
  builder.addAsyncThunk(update_card, {
    pending: state => {
      state.loading = true
      state.status = 'loading'
    },
    fulfilled: (state, action) => {
      state.active.dashboard.structure.cards = action.payload
      state.loading = false
      state.status = 'idle'
    },
    rejected: state => {
      state.error = 'failed to update the card'
    }
  })
}

