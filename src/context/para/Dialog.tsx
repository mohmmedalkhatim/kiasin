import { create } from 'zustand';

interface Dialog {
  mode: 'dialog_note' | 'dialog_calender' | 'dialog_links' | 'dialog_areas' | 'dialog_tasks'| 'dialog_setting' | 'dialog_notes';
  state: boolean;
  props: { id: number };
  changeMode: (
    mode: 'dialog_note' | 'dialog_calender' | 'dialog_links' | 'dialog_areas' | 'dialog_tasks'| 'dialog_setting' | 'dialog_notes',
    props: { id: number }
  ) => void;
  toggle: () => void;
  close: () => void;
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
  close: () => set({ state: false }),
}));
