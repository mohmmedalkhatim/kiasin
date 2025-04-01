import { Channel, invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { Note } from '../../types/notes';
import Note_card from '../../components/Cards/note_card';
import Button from '../../components/Button';
import { useNotes } from '../../context/para/notes';

function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, set_loading] = useState(true);
  const create = useNotes(state=>state.)
  useEffect(() => {
    const channel = new Channel<Note[]>();
    channel.onmessage = (res) => {
      setNotes(res);
      set_loading(false);
    };
    invoke('notes_control', { payload: { command: 'find' }, channel });
  }, []);
  if (loading) {
    <main className="content">loading...</main>;
  }
  return (
    <main className="content">
      {notes.map((item) => (
        <Note_card id={Number(item.id)} />
      ))}
      <Button onClick={}/>
    </main>
  );
}
export default Notes;
