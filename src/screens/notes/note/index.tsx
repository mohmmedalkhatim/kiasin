import { useParams } from 'react-router-dom';
import Editor from '../../../components/Editor';
import { useNotes } from '../../../context/para/notes';
import { useEffect, useState } from 'react';
import { Note } from '../../../types/notes';

function NotePage() {
  const get = useNotes((state) => state.note);
  const [notes, set_notes] = useState<Note>();
  const { id } = useParams();
  const activeList = useNotes((state) => state.active);
  useEffect(() => {
    get(Number(id)).then((data) => {
      set_notes(activeList.at(-1));
    });
  }, []);
  return (
    <div className="container">
      <Editor content={notes?.content as string} />
    </div>
  );
}
export default NotePage;
