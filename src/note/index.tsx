import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NotePage from './rich_editor_page';
import { useNotes } from '../context/para/notes';
import { Note } from '../types/notes';

function NotePageProvider() {
  const get = useNotes((state) => state.note);
  const [note, setNote] = useState<Note | undefined>({} as Note);
  const { id } = useParams();
  useEffect(() => {
    get(Number(id), setNote);
  }, []);
  if (note && note.content) {
    return <NotePage content={note.content} title={note.title} />;
  }
}
export default NotePageProvider;
