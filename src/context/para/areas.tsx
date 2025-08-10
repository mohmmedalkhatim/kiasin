import { create } from 'zustand';
import { Area, Card } from '../../types/area';
import { Channel, invoke } from '@tauri-apps/api/core';

interface Areas {
  list: Area[];
  active: Area[] | undefined;
  sort: string[];
  editable: boolean;
  init: () => Promise<void>;
  create: (id: number) => void;
  update: (area: Area) => void;
  toggleEditable: () => void;
  update_active_area: (area: Area) => void;
  delete_card: (id: number, update_sort: any) => void;
  get_Card: (id: number) => Card;
  update_card: (id: number, card: Card) => void;
  get_list_item: (id: number, setArea: any) => void;
  getArea: (
    id: number,
    setArea: React.Dispatch<React.SetStateAction<boolean>>
  ) => Area;
}

export const useAreas = create<Areas>(set => ({
  list: [],
  active: [],
  sort: [],
  editable: false,
  toggleEditable: () => {
    set(state => ({ editable: !state.editable }));
  },
  get_Card: id => {
    const state: Areas = useAreas.getState();
    const active = state.active?.at(-1);
    const card = active?.ui_schema.item.find(item => item.id === id);
    return card as Card;
  },
  update_card: (id: number, data: Card) => {
    set(state => {
      if (!state.active || state.active.length === 0) return state;
      const lastActiveIndex = state.active.length - 1;
      const lastActive = state.active[lastActiveIndex];

      const updatedItems = lastActive.ui_schema.item.map(item =>
        item.id === id ? { ...item, ...data } : item
      );

      const updatedActive = {
        ...lastActive,
        ui_schema: {
          ...lastActive.ui_schema,
          item: updatedItems,
        },
      };

      const updatedActiveArray = [
        ...state.active.slice(0, lastActiveIndex),
        updatedActive,
      ];
      if (updatedActive) {
        let update = useAreas.getState().update;
        update(updatedActive);
        state.active?.push(updatedActive);
      }

      return {
        ...state,
        active: updatedActiveArray,
      };
    });
  },
  update_active_area: area => {
    set(state => {
      let filtered = state.active?.filter(item => item.id !== area.id);
      return {
        active: [...(filtered as Area[]), area],
      };
    });
  },
  delete_card: (id, update_sort) => {
    set(state => {
      let conut = 0;
      let list = state.active as Area[];
      let active = state.active?.pop();
      let sort: string[] = [];
      let ui = active?.ui_schema.item.filter(item => item.id != id);
      ui = ui?.map(item => {
        item.id = conut++;
        sort.push(String(item.id));
        return item;
      });
      let act = { ...active, ui_schema: { item: ui } } as Area;
      let update = useAreas.getState().update;
      update(act);
      update_sort(sort);
      return { active: [...list, act] };
    });
  },
  get_list_item: (id: number, setArea) => {
    let s = {} as Area;
    set(state => {
      s = state.list.filter(item => item.id == id)[0];
      setArea(s);
      return { ...state }; 
    });
    return s;
  },
  init: async () => {
    const channel = new Channel<Area[]>(data => {
       data.map(item => {
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
        set(_state => ({ list: [...list] }));
      });
    });
    await invoke('areas_control', { payload: { command: 'find' }, channel });
  },
  create: (id: number) => {
    const channel = new Channel<Area[]>();
    invoke('areas_control', { payload: { command: 'create', id }, channel });
    channel.onmessage = data => {
      data.map(item => {
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
        set(state => ({ list: [...state.list, item] }));
      });
    };
  },
  create_from_Template: (template: number) => {
    const channel = new Channel<Area[]>();
    channel.onmessage = data => {
      data.map(item => {
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
        set(state => ({ list: [...state.list, item] }));
      });
      invoke('areas_control', {
        payload: { command: 'create', template },
        channel,
      });
    };
  },
  getArea: (id, set_Done) => {
    const channel = new Channel<Area[]>();
    let area: Area = {} as Area;
    channel.onmessage = data => {
      set(state => {
        const s = state.active?.filter(item => item.id !== id) as Area[];
        area = data[0];
        return { active: [...s, area] };
      });
      set_Done(true);
    };
    invoke('areas_control', { payload: { command: 'find', id }, channel });
    return area;
  },

  update: (area: Area) => {
    const channel = new Channel<Area[]>();
    channel.onmessage = data => {
      data.map(item => {
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
        set(state => ({
          list: [...state.list.filter(item => item.id != area.id), item],
        }));
      });
    };
    invoke('areas_control', {
      payload: { command: 'update', id: area.id, item: area },
      channel,
    });
  },
}));
