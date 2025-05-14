import { Channel, invoke } from '@tauri-apps/api/core';
import { create } from 'zustand';
import { Todo } from '../../types/todos';
import { data } from 'react-router-dom';

interface Tasks {
  list: Todo[];
  init: () => void;
  create: (title: string, id?: number) => void;
  get_list: (ids: string[]) => void;
  get_one: (ids: string) => Todo;
}

export let useTasks = create<Tasks>(set => ({
  list: [],
  init: () => {
    let channel = new Channel<Todo[]>();
    channel.onmessage = list => {
      set({ list });
    };
    invoke('todos_control', { payload: { command: 'find' } });
  },
  create: (title, id) => {
    let channel = new Channel<Todo[]>();
    channel.onmessage = data => {
      set(state => ({ list: [...state.list, data[0]] }));
    };
    invoke('todos_control', {
      payload: { command: 'create', item: { title, id } },
    });
  },
  get_list: ids => {
    let list: Todo[] = [];
    let channel = new Channel<Todo[]>();
    channel.onmessage = data => {
      data.map(item => list.push(item));
    };
    invoke('todos_control', { payload: { command: 'find', ids } });
    return list;
  },
  get_one: id => {
    let channel = new Channel<Todo[]>();
    let data: Todo = {} as Todo;
    channel.onmessage = item => {
      data = item[0];
    };
    invoke('todo_control', { payload: { command: 'find', id } });
    return data;
  },
}));
