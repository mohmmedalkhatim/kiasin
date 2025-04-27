import { useEffect, useState } from 'react';
import { Note } from '../../../types/notes';
import Note_card from './card';
import './index.css';
import { useNotes } from '../../../context/para/notes';
import { useAreas } from '../../../context/para/areas';
function NoteList({ id }: { id: number }) {
  let get_card = useAreas((state) => state.get_Card);
  let get_notes = useNotes((state) => state.get_notes);
  let update = useAreas((state) => state.update_card);
  let card = get_card(id);
  let [notes] = useState(get_notes(card.props.list));
  return (
    <div className="note_grid">
      <div>
        <div></div>
        <div className=""></div>
      </div>
      {notes.map((item, i) => (
        <Note_card
          key={i}
          content={item.content}
          title={item.title}
          id={item.id}
        />
      ))}
    </div>
  );
}
export default NoteList;
