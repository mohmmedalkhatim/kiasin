import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { setActive, SheetStore } from '..'
import { Channel, invoke } from '@tauri-apps/api/core'
import { Sheet } from '../objects'
import {} from '..'
export let retrieve_sheet = createAsyncThunk(
  'sheet/data',
  async (id: number, api) => {
    let sheet; 
    try {
      let channel = new Channel<Sheet[]>((res) => {
        sheet = res[0]
        api.dispatch(setActive(sheet))
      })
      await invoke("sheets_control", { payload: { command: "retrieve", id }, channel });
    
    } catch (error) {
      
      api.rejectWithValue(error)
    }
    console.log(sheet)
  }
)

export let retrieve_table_thunk_builder = (
  builder: ActionReducerMapBuilder<SheetStore>
) => {
  builder.addAsyncThunk(retrieve_sheet, {
    pending: (state, _) => {
      ; state.loading = true 
        state.status = 'pending'
    },
    fulfilled: (state ) => {
      state.loading = false
      state.status = 'fulfilled'
    },
    rejected: (_) => {
    }
  })
}
