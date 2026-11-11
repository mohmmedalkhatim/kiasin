import { configureStore } from '@reduxjs/toolkit'
import dashboards_slice from '../contexts/dashboard'
import database_slice from './sheets'
import forms_slice from './forms'

export let store = configureStore({
  reducer: {
    dashboard: dashboards_slice,
    database: database_slice,
    forms: forms_slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
