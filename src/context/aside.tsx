import { ReactElement } from 'react';
import { create } from 'zustand';

interface Aside_state {
  active: boolean;
  inside: ReactElement;
  toggle: () => void;
  SwichType: (element: ReactElement) => void;
}
export const useAside = create<Aside_state>(set => ({
  active: false,
  inside: <></>,
  toggle: () => {
    set(state => ({ active: !state.active }));
  },
  SwichType: element => {
    set(({ inside: element }));
  },
}));
