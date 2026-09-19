import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { SheetStore } from '..'
import { Channel, invoke } from '@tauri-apps/api/core';
import { Sheet } from '../objects';

export let create_sheet = createAsyncThunk(
  'sheets/create',
  async (table: Sheet, api) => {
    let channel = new Channel<any>((res)=>{
      console.log("we have a responece")
      console.log(res)
    })

    await invoke<any>("sheets_control",{payload:{ command:"create", data:table},channel}).catch(err=>{
      api.rejectWithValue(err)
    }).then((res)=>{
      console.log("creating has been successful")
      console.log(res) 
    })
  }
)

export let create_table_thunk_builder = (
  builder: ActionReducerMapBuilder<SheetStore>
) => {
  builder.addAsyncThunk(create_sheet, {
    pending: (state) => {
      state.loading = true,
      state.status = "pending"
    },
    fulfilled: (state) => {
      state.loading = false
      state.status = "fullfilled"
    },
    rejected: (_err) => {}   
  })
}
