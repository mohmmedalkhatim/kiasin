import { create } from 'zustand';
import { Area } from '../../types/area';
import { Channel, invoke } from '@tauri-apps/api/core';

interface Areas {
  list: Area[];
  active: Area[] | undefined;
  editable: boolean;
  init: () => void;
  create: (id: number) => void;
  update: (area: Area) => void;
  taggleEditable: () => void;
  getArea: (
    id: number,
    setArea: React.Dispatch<React.SetStateAction<boolean>>
  ) => Area;
  get_list_item: (id: number) => Area | undefined;
}

export const useAreas = create<Areas>((set) => ({
  list: [],
  active: [],
  editable: false,
  taggleEditable: () => {
    set((state) => ({ editable: !state.editable }));
  },
  get_list_item: (id: number) => {
    let s = {} as Area;
    set((state) => {
      s = state.list.filter((item) => item.id == id)[0];
      return { ...state }; // Ensure the function returns the updated state
    });
    return s;
  },
  init: () => {
    const channel = new Channel<Area[]>();
    channel.onmessage = (data) => {
      data.map((item) => {
        console.log('area', item);
        const icon = URL.createObjectURL(
          new Blob([new Uint8Array(item.icon as number[])], {
            type: 'image/jpeg',
          })
        );
        item.icon = icon;
        const cover = URL.createObjectURL(
          new Blob([new Uint8Array(item.cover as number[])], {
            type: 'image/jpeg',
          })
        );
        item.cover = cover;
        const list = new Set<Area>(data);
        list.add(item);
        set((state) => ({ list: [...list] }));
      });
    };
    return invoke('areas_control', { payload: { command: 'find' }, channel });
  },

  create: (id: number) => {
    const channel = new Channel<Area[]>();
    invoke('areas_control', { payload: { command: 'create', id }, channel });
    channel.onmessage = (data) => {
      data.map((item) => {
        const icon = URL.createObjectURL(
          new Blob([new Uint8Array(item.icon as number[])], {
            type: 'image/jpeg',
          })
        );
        item.icon = icon;
        const cover = URL.createObjectURL(
          new Blob([new Uint8Array(item.cover as number[])], {
            type: 'image/jpeg',
          })
        );
        item.cover = cover;
        set((state) => ({ list: [...state.list, item] }));
      });
    };
  },
  getArea: (id, setdone) => {
    const channel = new Channel<Area[]>();
    let area: Area = {} as Area;
    channel.onmessage = (data) => {
      set((state) => {
        const s = state.active?.filter((item) => item.id !== id) as Area[];
        area = data[0];
        return { active: [...s, area] };
      });
      setdone(true);
    };
    invoke('areas_control', { payload: { command: 'find', id }, channel });
    return area;
  },
  update: (area: Area) => {
    const channel = new Channel<Area[]>();
    channel.onmessage = (data) => {
      data.map((item) => {
        const icon = URL.createObjectURL(
          new Blob([new Uint8Array(item.icon as number[])], {
            type: 'image/jpeg',
          })
        );
        item.icon = icon;
        const cover = URL.createObjectURL(
          new Blob([new Uint8Array(item.cover as number[])], {
            type: 'image/jpeg',
          })
        );
        item.cover = cover;
        set((state) => ({
          list: [...state.list.filter((item) => item.id != area.id), item],
        }));
      });
    };
    invoke('areas_control', {
      payload: { command: 'update', id: area.id, item: area },
      channel,
    });
  },
}));
