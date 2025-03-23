import { useParams } from "react-router-dom"
import Editor from "../../components/Editor"
import { useNotes } from "../../context/para/notes"
import { useEffect, useState } from "react";
import { Note } from "../../types/notes";

function NotePage() {
    let get = useNotes(state => state.note);
    let [done, setDone] = useState(false);
    let [notes, setnotes] = useState<Note>();
    let { id } = useParams()
    let activeList = useNotes(state => state.active);
    useEffect(() => {
        get(Number(id), setDone).then(data => {
            setnotes(activeList.at(-1));
        })
    }, [])
    if (done) {
        return <div className="container">
            <Editor content={notes?.content as string} />
        </div>
    }
}
export default NotePage