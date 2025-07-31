import { IconLink } from '@tabler/icons-react';
import Rich_Editor from './Editor';
import './style.css';
import useNoteCard from './Hook';

const NoteViewer = ({ note_id }: {  note_id: number }) => {
  let {editor} = useNoteCard(note_id)
  if (editor)
    return (
      <div className=' border-none outline-none'>
        <Rich_Editor editor={editor} id={note_id} />
        <div className='absolute bottom-4 right-4' onClick={() => { }}>
          <IconLink color='#e2e2e280' size={'1.4rem'} />
        </div>
      </div>
    );
}

export default NoteViewer;
