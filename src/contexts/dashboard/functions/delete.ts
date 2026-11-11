import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { Dashboard, dashboards_storage } from '..'
import { Channel, invoke } from '@tauri-apps/api/core'
import { storage } from '../../../main'

export let delete_dashboard = createAsyncThunk(
  'dashboard/delete',
  async (id: number, api) => {
    let res = {} as Dashboard
    try {
      let channel = new Channel<Dashboard[]>(state => {
        res = state[0]
      })
      await invoke('areas_control', {
        payload: { command: 'delete', id } ,
        channel
      }).catch(err => {
        console.error('there is a problem invoking create_area: ', err)
      })
    } catch (err) {
      api.rejectWithValue('there is a problem retrieving a dashboard: ' + err)
    }
    let dashboards: number[] | undefined = await storage.get('list')
    if (dashboards) {
      storage.set(
        'list',
        dashboards.filter(item => item != id)
      )
    }

    return res as Dashboard
  }
)

export let delete_thunk_builder = (
  builder: ActionReducerMapBuilder<dashboards_storage>
) => {
  builder.addAsyncThunk(delete_dashboard, {
    pending: state => {
      state.status = 'loading'
      state.loading = true
    },
    fulfilled: state => {
      state.status = 'succeeded'
      state.loading = false
    },
    rejected: state => {
      state.status = 'failed'
      state.loading = false
      state.error = 'There was an error creating the dashboard.'
    }
  })
}
