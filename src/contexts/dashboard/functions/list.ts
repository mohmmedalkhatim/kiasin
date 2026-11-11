import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { Dashboard, dashboards_storage } from '..'
import { Channel, invoke } from '@tauri-apps/api/core'
import { Dispatch, SetStateAction } from 'react'

export let list = createAsyncThunk('dashboard/list', async function(setAreas:Dispatch<SetStateAction<Dashboard[]>>,api) {
  let res = [] as Dashboard[]
  try {
    let channel = new Channel<Dashboard[]>(state => {
      setAreas(state)
    })
    await invoke('areas_control', {
      payload: { command:"list" },
      channel
    }).catch(err => {
      console.error('there is a problem invoking create_area: ', err)
    })
  } catch (err) {
    api.rejectWithValue("error creating ")
    console.error("there an error with the code: ",err)
  }
  return res as Dashboard[]
})


export let list_thunk_builder = (builder: ActionReducerMapBuilder<dashboards_storage>) => {
  builder.addAsyncThunk(list, {
    pending: state => {
      state.status = 'loading'
      state.loading = true
    },
    fulfilled: (state, action) => {
      state.status = 'succeeded'
      state.loading = false
      state.list = action.payload
    },
    rejected: state => {
      state.status = 'failed'
      state.loading = false
      state.error = 'There was an error creating the dashboard.'
    }
  })
}
