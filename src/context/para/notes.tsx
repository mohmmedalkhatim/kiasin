import { create } from 'zustand';
import { Note } from '../../types/notes';
import { Channel, invoke } from '@tauri-apps/api/core';

interface Notes {
  list: Note[];
  active: Note;
  loading: boolean;
  area_notes: (area_id: number) => void;
  updata_note: (id: number, item: Note) => Promise<void>;
  create_blank: () => void;
  get_notes: (ids: number[]) => Note[];
  init: () => void;
  note: (
    id: number,
    setNote: React.Dispatch<React.SetStateAction<Note>>
  ) => Promise<void>;
  create: (id: number) => void;
}

export const useNotes = create<Notes>(set => ({
  list: [],
  active: {} as Note,
  loading: false,
  init: () => {
    let channel = new Channel<Note[]>();
    channel.onmessage = data => {
      set({ list: [...data] });
    };
    invoke('notes_control', { payload: { command: 'find' }, channel });
  },
  get_notes: ids => {
    let list: Note[] = [];
    let channel = new Channel<Note[]>();
    channel.onmessage = data => {
      list.push(...data);
    };
    set({ list });
    return list;
  },
  area_notes: id => {
    const channel = new Channel<Note[]>();
    const list: Note[] = [];
    channel.onmessage = data => {
      data.map(item => list.push(item));
      set({ list });
    };
    invoke('notes_control', { payload: { command: 'area_notes', id }, channel })
      .then(e => {})
      .catch(e => {
        console.log(e);
      });
  },

  create: id => {
    let channel = new Channel<Note[]>();
    channel.onmessage = msg => {
      set({ active: msg[0] });
    };
    invoke('notes_control', { payload: { command: 'create', id }, channel });
  },
  create_blank: () => {
    let channel = new Channel<Note[]>();
    channel.onmessage = msg => {
      set(state => ({ list: [...state.list, msg[0]] }));
    };
    invoke('notes_control', { payload: { command: 'create_blank' }, channel });
  },
  updata_note:  async (id, item) => {
    const channel = new Channel<Note[]>();
    await invoke('notes_control', {
      payload: { command: 'update', id, item },
      channel,
    })
      .then(e => {
        console.log('the note with the title ' + item.title + ' has been save');
      })
      .catch(e => console.log(e));
    set(state => {
      const list: Note[] = state.list.map(ele => (ele.id != id ? ele : item));
      return { list, active: item };
    });
  },
  note: async (id: number, setNote) => {
    const channel = new Channel<Note[]>();
    channel.onmessage = note => {
      set({ active: note[0], loading: false });
      setNote(note[0]);
    };
    invoke('notes_control', { payload: { command: 'find', id }, channel });
  },
}));
