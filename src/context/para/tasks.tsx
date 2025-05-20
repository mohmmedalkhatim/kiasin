import { Channel, invoke } from '@tauri-apps/api/core';
import { create } from 'zustand';
import { Todo } from '../../types/todos';
import { data } from 'react-router-dom';

interface Tasks {
  list: Todo[];
  temp:Todo;
  init: () => void;
  create: (title: string) => Todo;
  get_list: (ids: string[]) => void;
  get_one: (id: string) => void;
}

export let useTasks = create<Tasks>(set => ({
  list: [],
  temp:{} as Todo,
  init: () => {
    let server = new Channel<Todo[]>();
    server.onmessage = list => {
      set({ list });
    };
    invoke('todos_control', { payload: { command: 'find' } ,server});
  },
  create: (title) => {
    let server = new Channel<Todo[]>();
    let task = [] as Todo[];
    server.onmessage = data => {
      task.push(data[0])
      set(state => {
        return ({ list: [...state.list, data[0]],temp:data[0] })
      });
    };
    invoke('todos_control', {
      payload: { command: 'create',item: { title } },
      server,
    });
    console.log(task)
    return task[0];
  },
  get_list: ids => {
    let list: Todo[] = [];
    let server = new Channel<Todo[]>();
    server.onmessage = data => {
      data.map(item => list.push(item));
    };
    invoke('todos_control', { payload: { command: 'find', ids } ,server});
    return list;
  },
  get_one: id => {
    let server = new Channel<Todo[]>();
    let data: Todo[] = [] as Todo[];
    server.onmessage = item => {
      data.push(item[0])
      set(state=>({temp:item[0]}))
    };
    invoke('todos_control', { payload: { command: 'find', id:Number(id) } ,server });
  },
}));
