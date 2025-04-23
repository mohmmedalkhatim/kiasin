import { create } from 'zustand';
import { Area, Card } from '../../types/area';
import { Channel, invoke } from '@tauri-apps/api/core';

interface Areas {
  list: Area[];
  active: Area[] | undefined;
  sort: string[];
  editable: boolean;
  init: () => void;
  create: (id: number) => void;
  update: (area: Area) => void;
  toggleEditable: () => void;
  update_active_area: (area: Area) => void;
  delete_card: (id: number, update_sort: any) => void;
  get_Card: (id: number) => void;
  update_card: (id: number, card: Card) => void;
  getArea: (
    id: number,
    setArea: React.Dispatch<React.SetStateAction<boolean>>
  ) => Area;
  get_list_item: (id: number) => Area | undefined;
}

export const useAreas = create<Areas>((set) => ({
  list: [],
  active: [],
  sort: [],
  editable: false,
  toggleEditable: () => {
    set((state) => ({ editable: !state.editable }));
  },
  get_Card: (id) => {
    let card = {} as Card;
    set((state) => {
      let active = state.active?.at(-1);
      card = active?.ui_schema.item.find((item) => item.id == id) as Card;
      return { ...state };
    });
    return card;
  },
  update_card: (id, data) => {
    set((state) => {
      let active = state.active?.pop();
      let newShema = active?.ui_schema.item.map((item) => {
        if (item.id == id) {
          item = data;
        }
        return item;
      });
      if (active) {
        active.ui_schema = { item: newShema as Card[] };
        state.active?.push(active);
      }
      return { ...state };
    });
  },
  update_active_area: (area) => {
    set((state) => {
      let filtered = state.active?.filter((item) => item.id !== area.id);
      return {
        active: [...(filtered as Area[]), area],
      };
    });
  },
  delete_card: (id, update_sort) => {
    set((state) => {
      let conut = 0;
      let list = state.active as Area[];
      let active = state.active?.pop();
      let sort: string[] = [];
      let ui = active?.ui_schema.item.filter((item) => item.id != id);
      console.log(ui);
      ui = ui?.map((item) => {
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
  get_list_item: (id: number) => {
    let s = {} as Area;
    set((state) => {
      s = state.list.filter((item) => item.id == id)[0];
      return { ...state }; // Ensure the function returns the updated state
    });
    return s;
  },
  get_list: (ids: number[]) => {},
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
  create_from_Template: (template: number) => {
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
        set((state) => ({ list: [...state.list, item] }));
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
    channel.onmessage = (data) => {
      set((state) => {
        const s = state.active?.filter((item) => item.id !== id) as Area[];
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
