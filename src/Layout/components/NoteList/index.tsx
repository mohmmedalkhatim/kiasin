import { Note } from "../../../types/notes"
import Note_card from "./card"
import "./index.css"
function NoteList({ list }: { list: Note[] }) {
    return (
        <div className="note_grid">
            {
                list.map((item, i) => (<Note_card key={i} content={item.content} title={item.title} id={item.id} />))
            }
        </div>
    )
}
export default NoteList