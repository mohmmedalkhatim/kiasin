import { Channel, invoke } from '@tauri-apps/api/core';
import { create } from 'zustand';
import { Todo } from '../../types/todos';
import { useAreas } from './areas';

interface Tasks {
  list: Todo[];
  init: () => void;
  create: (title: string, card_id: number) => Promise<void>;
  get_list: (ids: string[], setItem: any) => void;
  get_one: (id: string, setItem: any) => Promise<void>;
}

export let useTasks = create<Tasks>(set => ({
  list: [],
  init: () => {
    let server = new Channel<Todo[]>();
    server.onmessage = list => {
      set({ list });
    };
    invoke('todos_control', { payload: { command: 'find' }, server });
  },
  create: async (title, card_id) => {
    let server = new Channel<Todo[]>();
    server.onmessage = data => {
      let card = useAreas.getState().get_Card(card_id);
      card.props.list.push(data[0].id);
      useAreas.getState().update_card(card_id, card);
      set(state => {
        return { list: [...state.list, data[0]] };
      });
    };
    await invoke('todos_control', {
      payload: { command: 'create', item: { title } },
      server,
    });
  },
  get_list: ids => {
    let list: Todo[] = [];
    let server = new Channel<Todo[]>();
    server.onmessage = data => {
      data.map(item => list.push(item));
    };
    invoke('todos_control', { payload: { command: 'find', ids }, server });
    return list;
  },
  get_one: async (id, setItem) => {
    let server = new Channel<Todo[]>();
    let data: Todo[] = [] as Todo[];
    server.onmessage = item => {
      data.push(item[0]);
      setItem(item[0]);
    };
    invoke('todos_control', {
      payload: { command: 'find', id: Number(id) },
      server,
    });
  },
}));
