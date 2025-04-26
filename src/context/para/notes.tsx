import { create } from 'zustand';
import { Note } from '../../types/notes';
import { Channel, invoke } from '@tauri-apps/api/core';

interface Notes {
  list: Note[];
  active: Note[];
  area_notes: (area_id: number) => void;
  updata_note: (id: number, item: Note) => void;
  create_blank: () => void;
  get_notes: (ids: number[]) => Note[];
  init: () => void;
  note: (id: number) => void;
  create: (id: number) => void;
}

export const useNotes = create<Notes>((set) => ({
  list: [],
  active: [],
  init: () => {
    let list: Note[] = [];
    let channel = new Channel<Note[]>()
    channel.onmessage = (data) => {
      list.push(...data)
    }
    invoke("notes_control", { payload: { command: "find" }, channel })
    set({ list })
  },
  get_notes: (ids) => {
    let list: Note[] = [];
    let channel = new Channel<Note[]>()
    channel.onmessage = (data) => {
      list.push(...data)
    }
    return list
  },
  area_notes: (id) => {
    const channel = new Channel<Note[]>();
    const list: Note[] = [];
    channel.onmessage = (data) => {
      data.map((item) => list.push(item));
      set({ list });
    };
    invoke('notes_control', { payload: { command: 'area_notes', id }, channel })
      .then((e) => { })
      .catch((e) => {
        console.log(e);
      });
  },

  create: (id) => {
    let channel = new Channel();
    channel.onmessage = (msg) => {
      set((state) => ({ active: [msg as Note] }));
    };
    invoke('notes_control', { payload: { command: 'create', id }, channel });
  },
  create_blank: () => {
    let channel = new Channel();
    channel.onmessage = (msg) => {
      set((state) => ({ active: [...state.active, msg as Note] }));
    };
    invoke('notes_control', { payload: { command: 'create_blank' }, channel });
  },
  updata_note: (id, item) => {
    const channel = new Channel<Note[]>();
    set((state) => {
      const list: Note[] = state.list.map((ele) =>
        ele.id != id ? ele : item
      );
      return { list };
    });
    invoke('notes_control', {
      payload: { command: 'update', id, item },
      channel,
    })
      .then((e) => { console.log("the note with the title " + item.title + " has been save") })
      .catch((e) => console.log(e));
  },
  note: (id: number) => {
    const channel = new Channel<Note[]>();
    channel.onmessage = (note) => {
      set(state => ({ active: [...state.active, note[0]] }))
    }
    invoke("notes_control", { payload: { command: "find", id }, channel })
  },
}))
