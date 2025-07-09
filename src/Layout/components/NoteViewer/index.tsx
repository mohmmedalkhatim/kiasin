import { IconLink } from '@tabler/icons-react';
import { useNotes } from '../../../context/para/notes';
import Rich_Editor from './Editor';
import { useEffect, useState } from 'react';
import './style.css';

const NoteViewer = ({ id }: { id: number }) => {
  const get_note = useNotes(state => state.note);
  const active = useNotes(state => state.active);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    get_note(id , setloading);
  }, []);
  if (!loading) {
    return (
      <div className=' border-none outline-none'>
        <Rich_Editor content={active.content} id={id} />
        <div className='absolute bottom-4 right-4' onClick={() => {}}>
          <IconLink color='#e2e2e280' size={'1.4rem'} />
        </div>
      </div>
    );
  }
};

export default NoteViewer;
