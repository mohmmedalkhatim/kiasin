import { create } from 'zustand'

interface Aside_state {
  active: boolean
  T: string
  toggle: () => void
  SwichType: () => void
}
export let useAside = create<Aside_state>(set => ({
  active: false,
  T: '',
  toggle: () => {
    set(state => ({ active: state.active }))
  },
  SwichType: () => {
    set(state => ({ T: state.T == 'area' ? 'cards' : 'area' }))
  }
}))
