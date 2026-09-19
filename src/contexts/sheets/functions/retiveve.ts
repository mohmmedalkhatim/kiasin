import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { SheetStore } from '..'
import { Channel, invoke } from '@tauri-apps/api/core'
import { Sheet } from '../objects'

export let retrieve_sheet = createAsyncThunk(
  'sheet/data',
  async (id: number, api) => {
    let sheet:Sheet = {};
    try {
      let channel = new Channel<Sheet>((res) => {
        sheet = res
      })
      await invoke("sheets_control", { payload: { command: "retrieve", id }, channel });
    } catch (error) {
      api.rejectWithValue(error)
    }
    return sheet 
  }
)

export let retrieve_table_thunk_builder = (
  builder: ActionReducerMapBuilder<SheetStore>
) => {
  builder.addAsyncThunk(retrieve_sheet, {
    pending: (state, _) => {
      ; (state.loading = true), (state.status = 'pending')
    },
    fulfilled: (state, action) => {
      state.active = action.payload; 
      state.loading = false
      state.status = 'fulfilled'
    },
    rejected: (_) => {
    }
  })
}
