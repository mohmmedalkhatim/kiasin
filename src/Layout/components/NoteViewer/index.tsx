import { IconLink } from '@tabler/icons-react';
import { useNotes } from '../../../context/para/notes';
import Rich_Editor from './Editor';
import { useEffect, useState } from 'react';
import './style.css';
import { Note } from '../../../types/notes';

const NoteViewer = ({ id }: { id: number }) => {
  const get_note = useNotes(state => state.note);
  const [note, setNote] = useState({} as Note);
  useEffect(() => {
    get_note(id ,setNote);
  }, []);
  if (note.content) {
    return (
      <div className=' border-none outline-none'>
        <Rich_Editor content={note.content} id={id} />
        <div className='absolute bottom-4 right-4' onClick={() => {}}>
          <IconLink color='#e2e2e280' size={'1.4rem'} />
        </div>
      </div>
    );
  }
};

export default NoteViewer;
