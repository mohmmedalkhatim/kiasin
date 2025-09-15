import { useAreas } from "../../../../context/para/areas"
import { useLayoutDialog } from "../../../../context/para/Dialog";
import { useNotes } from "../../../../context/para/notes";
import NoteCard from "./Card";

function NotesList({ id }: { id: number }) {
    const card = useAreas(state => state.get_Card)(id);
    const close = useLayoutDialog(state => state.close)
    const update_card = useAreas(state => state.update_card);
    const notes = useNotes(state => state.list)
    return (
        <div className="notes_page p-6">
            {notes.map((item, index) => <NoteCard key={index} note={item} action={() => {
                card.props.note_id = item.id;
                card.props.note_title = item.title;
                console.log(card.props)
                update_card(id, card)
                close()
            }} />)}
        </div>
    )
}
export default NotesList