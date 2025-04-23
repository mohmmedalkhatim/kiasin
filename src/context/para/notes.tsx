import { create } from 'zustand';
import { Note } from '../../types/notes';
import { Channel, invoke } from '@tauri-apps/api/core';

interface Notes {
  list: Note[];
  active: Note[];
  area_notes: (area_id: number) => void;
  updata_note: (id: number, item: Note) => void;
  create_blank: () => void;
  note: (id: number) => Promise<void>;
  create: (id: number) => void;
}

export const useNotes = create<Notes>((set) => ({
  list: [],
  active: [],
  area_notes: (id) => {
    const channel = new Channel<Note[]>();
    const list: Note[] = [];
    channel.onmessage = (data) => {
      data.map((item) => list.push(item));
      set({ list });
    };
    invoke('notes_control', { payload: { command: 'area_notes', id }, channel })
      .then((e) => {})
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
        ele.id != String(id) ? ele : item
      );
      return { list };
    });
    invoke('notes_control', {
      payload: { command: 'update_note', id },
      channel,
    })
      .then((e) => {})
      .catch((e) => console.log(e));
  },
  note: async (id: number) => {
    const channel = new Channel<Note[]>();
    set((state) => {
      const list = new Set(state.active);
      channel.onmessage = (data) => {
        if (list.has(data[0])) {
          list.delete(data[0]);
          list.add(data[0]);
        } else {
          list.add(data[0]);
        }
      };
      return {
        active: [...list],
      };
    });
    invoke('notes_control', { payload: { command: 'find', id }, channel });
  },
}));
