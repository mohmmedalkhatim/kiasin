import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { FormDef, FormsStorage } from '..'
import { storage } from '../../../main'

const STORE_KEY = 'forms'

export let delete_form = createAsyncThunk(
  'forms/delete',
  async (id: string) => {
    let existing: FormDef[] = (await storage.get(STORE_KEY)) ?? []
    let updated = existing.filter(f => f.id !== id)
    await storage.set(STORE_KEY, updated)
    await storage.save()
    return id
  }
)

export let delete_form_thunk_builder = (
  builder: ActionReducerMapBuilder<FormsStorage>
) => {
  builder.addAsyncThunk(delete_form, {
    pending: state => {
      state.status = 'loading'
      state.loading = true
    },
    fulfilled: (state, action) => {
      state.status = 'succeeded'
      state.loading = false
      state.list = state.list.filter(f => f.id !== action.payload)
      if (state.active?.id === action.payload) {
        state.active = null
      }
    },
    rejected: state => {
      state.status = 'failed'
      state.loading = false
      state.error = 'There was an error deleting the form.'
    }
  })
}
