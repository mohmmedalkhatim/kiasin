import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useNotes } from '../../../context/para/notes';
import { useEffect, useState } from 'react';
import NotePage from './rich_editor_page';

function NotePageProvider() {
  const get = useNotes((state) => state.note);
  const [loading, setloading] = useState(true);
  const { id } = useParams();
  const content = useNotes((state) => state.active).content;
  useEffect(() => {
    get(Number(id), setloading);
    console.log(JSON.stringify(content));
  }, []);
  if (content && !loading) {
    return <NotePage content={content} />;
  }
}
export default NotePageProvider;
