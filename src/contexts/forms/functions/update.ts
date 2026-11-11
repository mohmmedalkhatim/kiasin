import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { FormDef, FormsStorage } from '..'
import { storage } from '../../../main'

const STORE_KEY = 'forms'

export let update_form = createAsyncThunk(
  'forms/update',
  async (form: FormDef) => {
    let existing: FormDef[] = (await storage.get(STORE_KEY)) ?? []
    let updated = existing.map(f => f.id === form.id ? form : f)
    await storage.set(STORE_KEY, updated)
    await storage.save()
    return form
  }
)

export let update_form_thunk_builder = (
  builder: ActionReducerMapBuilder<FormsStorage>
) => {
  builder.addAsyncThunk(update_form, {
    pending: state => {
      state.status = 'loading'
      state.loading = true
    },
    fulfilled: (state, action) => {
      state.status = 'succeeded'
      state.loading = false
      state.list = state.list.map(f => f.id === action.payload.id ? action.payload : f)
      if (state.active?.id === action.payload.id) {
        state.active = action.payload
      }
    },
    rejected: state => {
      state.status = 'failed'
      state.loading = false
      state.error = 'There was an error updating the form.'
    }
  })
}
