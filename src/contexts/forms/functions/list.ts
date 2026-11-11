import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { FormDef, FormsStorage } from '..'
import { storage } from '../../../main'

const STORE_KEY = 'forms'

export let list_forms = createAsyncThunk(
  'forms/list',
  async () => {
    let forms: FormDef[] = (await storage.get(STORE_KEY)) ?? []
    return forms
  }
)

export let list_forms_thunk_builder = (
  builder: ActionReducerMapBuilder<FormsStorage>
) => {
  builder.addAsyncThunk(list_forms, {
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
      state.error = 'There was an error listing forms.'
    }
  })
}
