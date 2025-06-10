import { create } from 'zustand';

interface Dialog {
  mode: 'dialog_note' | 'dialog_calender' | 'dialog_links' | 'dialog_areas';
  state: boolean;
  props: { id: number };
  changeMode: (
    mode: 'dialog_note' | 'dialog_calender' | 'dialog_links' | 'dialog_areas',
    props: { id: number }
  ) => void;
  toggle: () => void;
}

export let useLayoutDialog = create<Dialog>(set => ({
  mode: 'dialog_note',
  state: false,
  props: { id: 1 },
  changeMode: (mode, props) => {
    set(info => ({ mode, props, state: !info.state }));
  },
  toggle: () => {
    set(info => ({ state: !info.state }));
  },
}));
