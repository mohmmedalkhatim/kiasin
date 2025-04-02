import { Channel, invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { Note } from '../../types/notes';
import Note_card from '../../components/Cards/note_card';
import { IconBookUpload } from '@tabler/icons-react';
import { useAside } from '../../context/aside';

function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, set_loading] = useState(true);
  const toggle = useAside(state=>state.toggle) 
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
      <div className='notes_page'>
        {notes.map((item) => (
          <Note_card id={Number(item.id)} />
        ))}
        <button className='m_border flex items-center justify-center' onClick={()=>toggle("notes")}>
          <IconBookUpload/>
        </button>
      </div>
    </main>
  );
}
export default Notes;
