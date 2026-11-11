import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { create_table_thunk_builder } from './functions/create'
import { Sheet } from './objects'
import { retrieve_table_thunk_builder } from './functions/retiveve'
import { update_table_thunk_builder } from './functions/update'

export interface SheetStore {
  active:Sheet | null
  err: string
  status: string
  loading: boolean
  revision: number
}

let init:SheetStore = {
  active: null ,
  err: '',
  status: 'idle',
  loading: false,
  revision: 0
}

let databases = createSlice({
  name: 'databases',
  initialState: init,
  reducers: {
    setActive:(state,action:PayloadAction<Sheet>)=>{
      state.active = action.payload
    },
    bumpRevision:(state)=>{
      state.revision += 1
    }
  },
  
  extraReducers: builder => {
    create_table_thunk_builder(builder)
    retrieve_table_thunk_builder(builder)
    update_table_thunk_builder(builder)
  }
})

export const {setActive, bumpRevision} = databases.actions;

export default databases.reducer
