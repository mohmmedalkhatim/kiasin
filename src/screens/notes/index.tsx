import { useEffect, useState } from 'react';
import Note_card from '../../components/Cards/note_card';
import { IconBookUpload } from '@tabler/icons-react';
import { useAside } from '../../context/aside';
import { useNotes } from '../../context/para/notes';

function Notes() {
  const toggle = useAside((state) => state.toggle);
  let notes = useNotes((state) => state.list);
  let init = useNotes((state) => state.init);
  useEffect(() => {
    init();
  }, []);
  if (notes) {
    return (
      <main className="content">
        <div className="notes_page">
          {notes.map((item) => (
            <Note_card note={item} />
          ))}
          <button
            className="m_border flex items-center justify-center"
            onClick={() => toggle('notes')}
          >
            <IconBookUpload />
          </button>
        </div>
      </main>
    );
  }
}
export default Notes;
