import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { create } from 'zustand'

interface User {
  name: string
  email: string
  create: (email: string, password: string, name: string) => void
  update: () => void
  delete: () => void
}

export let useAuth = create<User>(set => ({
  name: '',
  email: '',
  create: (email, password, name) => {
    let res = invoke('user_control', {
      payload: { command: 'create', item: { email, password, name } }
    })
    listen<User>("user",e=>{
        console.log(`user event ${e.payload.name}`)
        set(state=>({name:e.payload.name,email:e.payload.email}))
    })
  },
  update: () => {},
  delete: () => {}
}))
