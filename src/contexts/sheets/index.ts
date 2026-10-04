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
}

let init:SheetStore = {
  active: null ,
  err: '',
  status: 'idle',
  loading: false
}

let databases = createSlice({
  name: 'databases',
  initialState: init,
  reducers: {
    setActive:(state,action:PayloadAction<Sheet>)=>{
      state.active = action.payload   
    }
      
  },
  
  extraReducers: builder => {
    create_table_thunk_builder(builder)
    retrieve_table_thunk_builder(builder)
    update_table_thunk_builder(builder)
  }
})

export const {setActive} = databases.actions;

export default databases.reducer
