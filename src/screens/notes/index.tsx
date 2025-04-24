import { useEffect, useState } from 'react';
import Note_card from '../../components/Cards/note_card';
import { IconBookUpload } from '@tabler/icons-react';
import { useAside } from '../../context/aside';
import { useNotes } from '../../context/para/notes';
import { Note } from '../../types/notes';

function Notes() {
  let init = useNotes(state => state.init)
  const toggle = useAside((state) => state.toggle);
  let notes = useNotes(state => state.list)
  const [list, setlist] = useState<Note[]>()
  useEffect(() => {
    init()
    setlist(notes)
  }, [])
  if (list) {
    return (
      <main className="content">
        <div className="notes_page">
          {list.map((item) => (
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
