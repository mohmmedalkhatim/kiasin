import { Channel, invoke } from '@tauri-apps/api/core';
import { create } from 'zustand';
import { Todo } from '../../types/todos';
import { useAreas } from './areas';

interface Tasks {
  list: Todo[];
  init: () => void;
  create: (title: string, card_id: number, column_id: number ) => Promise<void>;
  update: (data: Todo, setTask: React.Dispatch<React.SetStateAction<Todo | undefined>>, setChecked: (i: boolean) => void) => Promise<void>;
  get_list: (ids: number[], setItem: any) => void;
  get_one: (id: string, setTask: React.Dispatch<React.SetStateAction<Todo | undefined>>, setChecked: (i: boolean) => void) => Promise<void>;
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
  create: async (title, card_id, column_id) => {
    let server = new Channel<Todo[]>();
    server.onmessage = async data => {
      let card =  await useAreas.getState().get_Card(card_id);
      console.log(card)
      card.props.columns[column_id].list.push(data[0].id);
      useAreas.getState().update_card(card_id, card); 
    };
    await invoke('todos_control', {
      payload: { command: 'create', item: { title } },
      server,
    });
  },
  update: async (todo, setTask, setChecked) => {
    let server = new Channel<Todo[]>();
    server.onmessage = data => {
      setTask(data[0])
      setChecked(data[0].checked)
    };
    await invoke('todos_control', {
      payload: { command: 'update', item: todo },
      server,
    });
  },
  get_list: (ids, setlist) => {
    let server = new Channel<Todo[]>();
    server.onmessage = data => {
      setlist(data)
    };
    invoke('todos_control', { payload: { command: 'find', ids }, server });
  },
  get_one: async (id, setItem, setChecked) => {
    let server = new Channel<Todo[]>();
    server.onmessage = data => {
      setItem(data[0]);
      setChecked(data[0].checked)
    };
    invoke('todos_control', {
      payload: { command: 'find', id: Number(id) },
      server,
    });
  },
}));
