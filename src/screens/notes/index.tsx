import { Channel, invoke } from "@tauri-apps/api/core"
import { useEffect, useState } from "react"
import { Note } from "../../types/notes"
import Note_card from "../../components/Cards/note_card"

function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setloading] = useState(true)
  useEffect(() => {
    let channel = new Channel<Note[]>()
    channel.onmessage = (res) => {
      setNotes(res)
      setloading(false)
    }
    invoke("notes_control", { payload: { command: "find" }, channel })
  }, [])
  if (loading) {
    <main className="content">
      loading...
    </main>
  }
  return (
    <main className="content">
      {notes.map(item => (<Note_card id={Number(item.id)} />))}
    </main>
  )
}
export default Notes