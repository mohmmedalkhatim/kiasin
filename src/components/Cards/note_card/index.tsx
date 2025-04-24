import { Link } from 'react-router-dom';
import { Note } from '../../../types/notes';

const NoteCard = ({ note }: { note: Note }) => {
  return (
    <Link to={`/note/${note.id}`} className='relative flex flex-col rounded-md m_border bg-clip-border text-gray-700 shadow-md'>
      <div className="p-4">
        <h5 className="block text-md font-sans font-semibold leading-snug tracking-normal text-white antialiased">
          {note.title}
        </h5>
        <div className="px-4 py-3 flex items-center justify-between">
          <p>
            {note.content}
          </p>
        </div>
      </div>
    </Link>
  );
}
export default NoteCard;
