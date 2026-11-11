import { createSlice } from '@reduxjs/toolkit'
import { create_form_thunk_builder } from './functions/create'
import { list_forms_thunk_builder } from './functions/list'
import { update_form_thunk_builder } from './functions/update'
import { delete_form_thunk_builder } from './functions/delete'
import { retrieve_form_thunk_builder } from './functions/retrieve'

export type FieldType = 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'checkbox'

export type ColSpan = 1 | 2

export type FormLayout = 'basic' | 'inline' | 'grid' | 'block' | 'horizontal' | 'nolabel'

export interface FormField {
  id: string
  label: string
  type: FieldType
  placeholder: string
  required: boolean
  options: string[]
  colSpan: ColSpan
}

export interface FormDef {
  id: string
  name: string
  layout: FormLayout
  fields: FormField[]
  createdAt: string
}

export interface FormsStorage {
  loading: boolean
  error: string | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  active: FormDef | null
  list: FormDef[]
}

export let init: FormsStorage = {
  loading: false,
  error: null,
  status: 'idle',
  active: null,
  list: []
}

export let forms = createSlice({
  name: 'forms',
  initialState: init,
  reducers: _ => ({
    set_active(state, action) {
      state.active = action.payload
    },
    clear_active(state) {
      state.active = null
    }
  }),
  extraReducers: builder => {
    create_form_thunk_builder(builder)
    list_forms_thunk_builder(builder)
    update_form_thunk_builder(builder)
    delete_form_thunk_builder(builder)
    retrieve_form_thunk_builder(builder)
  }
})

export default forms.reducer
