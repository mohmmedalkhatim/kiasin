import { useNotes } from '../../../context/para/notes';
import { Link } from 'react-router-dom';

const NoteCard = ({ id }: { id: number }) => {
  const init = useNotes((state) => state.note);
  const getNote = useNotes((state) => state.note);
  const note = useNotes((state) => state.active).at(-1);
  const area = getNote(id);
  if (note) {
    return (
      <Link to={`/Area/${note.id}`}>
        <div className="relative flex flex-col rounded-md m_border bg-clip-border text-gray-700 shadow-md">
          <div
            style={{ backgroundImage: `url()` }}
            className="relative  h-28 overflow-hidden bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r border-[#e2e2e220] border-b"
          ></div>
          <div className="px-4 py-3 flex items-center justify-between">
            <h5 className="block text-md font-sans font-semibold leading-snug tracking-normal text-white antialiased">
              {note.title}
            </h5>
          </div>
        </div>
      </Link>
    );
  }
};
export default NoteCard;
