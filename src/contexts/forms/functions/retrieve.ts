import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { FormDef, FormsStorage } from '..'
import { storage } from '../../../main'

const STORE_KEY = 'forms'

export let retrieve_form = createAsyncThunk(
  'forms/retrieve',
  async (id: string) => {
    let existing: FormDef[] = (await storage.get(STORE_KEY)) ?? []
    let form = existing.find(f => f.id === id)
    if (!form) throw new Error('Form not found')
    return form
  }
)

export let retrieve_form_thunk_builder = (
  builder: ActionReducerMapBuilder<FormsStorage>
) => {
  builder.addAsyncThunk(retrieve_form, {
    pending: state => {
      state.status = 'loading'
      state.loading = true
    },
    fulfilled: (state, action) => {
      state.status = 'succeeded'
      state.loading = false
      state.active = action.payload
    },
    rejected: state => {
      state.status = 'failed'
      state.loading = false
      state.error = 'There was an error retrieving the form.'
    }
  })
}
