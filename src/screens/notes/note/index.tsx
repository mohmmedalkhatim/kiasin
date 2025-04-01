import { useParams } from 'react-router-dom';
import Editor from '../../../components/Editor';
import { useNotes } from '../../../context/para/notes';
import { useEffect, useState } from 'react';
import { Note } from '../../../types/notes';

function NotePage() {
  const get = useNotes((state) => state.note);
  const [done, setDone] = useState(false);
  const [notes, setnotes] = useState<Note>();
  const { id } = useParams();
  const activeList = useNotes((state) => state.active);
  useEffect(() => {
    get(Number(id)).then((data) => {
      setnotes(activeList.at(-1));
    });
  }, []);
  if (done) {
    return (
      <div className="container">
        <Editor content={notes?.content as string} />
      </div>
    );
  }
}
export default NotePage;
