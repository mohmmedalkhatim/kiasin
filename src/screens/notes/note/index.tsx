import { useParams } from 'react-router-dom';
import { useNotes } from '../../../context/para/notes';
import { useEffect, useState } from 'react';
import NotePage from './rich_editor_page';

function NotePageProvider() {
  const get = useNotes((state) => state.note);
  const [loading, setloading] = useState(true);
  const { id } = useParams();
  const content = useNotes((state) => state.active);
  useEffect(() => {
    get(Number(id), setloading);
  }, []);
  if (content.content && !loading) {
    return <NotePage content={content.content} title={content.title} />;
  }
}
export default NotePageProvider;
