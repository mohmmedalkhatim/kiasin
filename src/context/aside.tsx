import { create } from 'zustand';

interface Aside_state {
  active: boolean;
  Type: string;
  id: number;
  setDatabse_id: (id: number) => void;
  toggle: (element: string) => void;
  close: () => void;
}
export const useAside = create<Aside_state>((set) => ({
  active: false,
  Type: '',
  id: 0,
  setDatabse_id: (id) => { set(() => ({ id })) },
  toggle: (type) => {
    set((state) => ({ active: !state.active, Type: type }));
  },
  close: () => set({ active: false })
}));
