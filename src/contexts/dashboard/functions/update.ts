import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { Dashboard, dashboards_storage } from '..'
import { Channel, invoke } from '@tauri-apps/api/core'

export let update = createAsyncThunk('dashboard/update', async (dashboard: Dashboard, api) => {
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
    api.rejectWithValue('there is a problem retrieving a dashboard: ' + err)
  }
  return res
})

export let update_thunk_builder = (
  builder: ActionReducerMapBuilder<dashboards_storage>
) => {
  builder.addAsyncThunk(update, {
    pending: state => {
      state.status = 'loading'
    },
    fulfilled: (state, action) => {
      state.status = 'succeeded'
      state.active.dashboard = action.meta.arg
    },
    rejected: state => {
      state.status = 'failed'
      state.error = 'There was an error creating the dashboard.'
    }
  })
}
