import { configureStore } from '@reduxjs/toolkit'
import areas_slice from '../contexts/area'
import database_slice from './sheets'

export let store = configureStore({
  reducer: {
    area: areas_slice,
    database: database_slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
