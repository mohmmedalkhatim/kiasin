import { useNotes } from "../../../context/para/notes"

function Notes_templates() {
    let note = useNotes(state=>state)
  return (
    <div>
      <div className="m_border w-10 h-32" onClick={()=>{note.create_blank()}}></div>
    </div>
  )
}
export default Notes_templates