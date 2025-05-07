import { Channel, invoke } from '@tauri-apps/api/core';
import { create } from 'zustand';
import { Todo } from '../../types/todos';

interface Tasks {
  list: Todo[];
  init: () => void;
  create: (title: string, id?: number) => void;
  get_list: (ids: string[]) => void;
}

let useTasks = create<Tasks>((set) => ({
  list: [],
  init: () => {
    let channel = new Channel<Todo[]>();
    channel.onmessage = (list) => {
      set({ list });
    };
    invoke('todos_control', { payload: { command: 'find' } });
  },
  create: (title, id) => {
    let channel = new Channel<Todo[]>();
    channel.onmessage = (data) => {
      set((state) => ({ list: [...state.list, data[0]] }));
    };
    invoke('todos_control', { payload: { command: 'create', item: { title, id } } });
  },
  get_list: (ids) => { },
}));
