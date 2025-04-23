import { create } from 'zustand';

interface Aside_state {
  active: boolean;
  t: string;
  toggle: (element: string) => void;
}
export const useAside = create<Aside_state>((set) => ({
  active: false,
  t: '',
  toggle: (t) => {
    set((state) => ({ active: !state.active, t: t }));
  },
}));
