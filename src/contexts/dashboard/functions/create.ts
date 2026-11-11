import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { Channel, invoke } from '@tauri-apps/api/core'
import { Dashboard, dashboards_storage } from '..'

export let create_dashboard_async_function = createAsyncThunk(
  'dashboard/create',
  async _ => {
    let res: Dashboard | null = {} as Dashboard
    try {
      let channel = new Channel<Dashboard[]>(state => {
        res = state[0]
      })
      await invoke('areas_control', {
        payload: { command: 'create' },
        channel
      }).catch(err => {
        console.error('there is a problem invoking create_area: ', err)
      })

    } catch (err) {
      console.error('there is a problem creating a dashboard: ', err)
    }
    return res
  }
)

export let create_thunk_builder = (
  builder: ActionReducerMapBuilder<dashboards_storage>
) => {
  builder.addAsyncThunk(create_dashboard_async_function, {
    pending: state => {
      state.status = 'loading'
      state.loading = true
    },
    fulfilled: (state, action) => {
      state.status = 'succeeded'
      state.loading = false
      state.list.push(action.payload)
    },
    rejected: state => {
      state.status = 'failed'
      state.loading = false
      state.error = 'There was an error creating the dashboard.'
    }
  })
}
