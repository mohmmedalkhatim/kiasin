import { IconLink } from '@tabler/icons-react';
import Rich_Editor from './Editor';
import './style.css';
import { useState } from 'react';
import { useAsync } from 'react-use';
import { useNotes } from '../../../../context/para/notes';
import { Note } from '../../../../types/notes';
import { useLayoutDialog } from '../../../../context/para/Dialog';



const NoteViewer = ({ id }: { id: number }) => {
  const dialog = useLayoutDialog(state => state.state)
  const get_note = useNotes(state => state.note);
  const [note, setNote] = useState<Note>();
  useAsync(async () => {
    get_note(id, setNote)
  }, [dialog])

  if (note) {
    return (
      <div className=' border-none outline-none'>
        <Rich_Editor note={note} />
        <div className='absolute bottom-4 right-4' onClick={() => { }}>
          <IconLink color='#e2e2e280' size={'1.4rem'} />
        </div>
      </div>
    );
  }
}

export default NoteViewer;
