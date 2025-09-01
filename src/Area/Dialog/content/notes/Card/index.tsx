import { Note } from "../../../../../types/notes"

function NoteCard({ note, action }: { note: Note, action: () => void }) {
    return (
        <div className="p-4 m_border rounded" onClick={action}>
            <h5 className="block text-md mb-3 font-sans font-semibold leading-snug tracking-normal text-white antialiased">
                {note.title}
            </h5>
            <div className="m_border" />
            <div className="px-2 py-3 items-center text-xs flex justify-between">
                <p>{note.description}</p>
            </div>
        </div>
    )
}
export default NoteCard