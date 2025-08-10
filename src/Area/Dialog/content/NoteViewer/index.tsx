import { IconLink } from '@tabler/icons-react';
import Rich_Editor from './Editor';
import './style.css';
import { useEffect, useState } from 'react';
import { useAsync } from 'react-use';
import { useNotes } from '../../../../context/para/notes';
import { useTasks } from '../../../../context/para/tasks';
import { Note } from '../../../../types/notes';
import { Todo } from '../../../../types/todos';

const NoteViewer = ({ id }: { id: number }) => {
  const get_note = useNotes(state => state.note);
  const [task, setTask] = useState<Todo | undefined>();
  const [_check, setCheck] = useState(false);
  const get = useTasks(state => state.get_one)
  const [note, setNote] = useState<Note>();

  useEffect(() => {
    get(String(id), setTask, setCheck)
    if (task && task.note_id) {
      get_note(task.note_id, setNote)
    }
  }, [])

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
