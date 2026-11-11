import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit'
import { FormDef, FormsStorage } from '..'
import { storage } from '../../../main'

const STORE_KEY = 'forms'

export let create_form = createAsyncThunk(
  'forms/create',
  async (form: FormDef) => {
    let existing: FormDef[] = (await storage.get(STORE_KEY)) ?? []
    let updated = [...existing, form]
    await storage.set(STORE_KEY, updated)
    await storage.save()
    return form
  }
)

export let create_form_thunk_builder = (
  builder: ActionReducerMapBuilder<FormsStorage>
) => {
  builder.addAsyncThunk(create_form, {
    pending: state => {
      state.status = 'loading'
      state.loading = true
    },
    fulfilled: (state, action) => {
      state.status = 'succeeded'
      state.loading = false
      state.list.push(action.payload)
    },
    rejected: state => {
      state.status = 'failed'
      state.loading = false
      state.error = 'There was an error creating the form.'
    }
  })
}
