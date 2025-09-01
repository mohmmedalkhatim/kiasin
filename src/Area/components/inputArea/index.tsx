import { act, useEffect, useState } from "react"
import { useAreas } from "../../../context/para/areas"
import { JSONContent } from '@tiptap/react';
import { useNotes } from "../../../context/para/notes";
import Button from "../../../components/Button";
import { IconLink } from "@tabler/icons-react";
import { useLayoutDialog } from "../../../context/para/Dialog";
import { Note } from "../../../types/notes";

function TextInputArea({ id }: { id: number }) {
    const card = useAreas(state => state.get_Card)(id)
    const get_card = useAreas(state => state.get_Card)
    const update = useAreas(state => state.update_card)
    const [content, setContent] = useState(card.props?.content || "")
    const dialog = useLayoutDialog(state => state.changeMode)
    const active = useAreas(state => state.active)?.at(-1)
    const update_note = useNotes(state => state.updata_note)
    const get_note = useNotes(state => state.note)
    const [note, setnote] = useState<Note>()
    useEffect(() => {
        setContent(card.props.content)
        if (card.props.note_id && active?.note_id) {
            get_note(card.props.note_id | active?.note_id, setnote)
        }
    }, [active])
    return (
        <form className="p-4 w-full h-full relative" onSubmit={(e) => {
            e.preventDefault()
            let json: JSONContent = {
                "attrs": {
                    "textAlign": null
                },
                "content": [
                    {
                        "text": content,
                        "type": "text"
                    }
                ],
                "type": "paragraph"
            };
            if (note) {
                let data = note
                if (data.content?.content) {
                    data?.content?.content.push(json)
                    update_note(note.id, data)
                } else {
                    data.content = { content: [] }
                    if (data.content.content) {
                        data.content.content.push(json)
                        update_note(note.id, data)
                    }
                }
            }
            card.props = { ...card.props, content: "" };
            update(id, card)
            setContent("")
        }}>
            <textarea className="focus:outline-none w-full h-full" placeholder="start writing" value={content} onChange={e => {
                card.props.content = e.target.value;
                update(card.id, card)
                setContent(e.target.value)
            }} />
            <div className="absolute flex items-center gap-4 right-4 bottom-4">
                <div onClick={() => {
                    dialog("dialog_notes", { id })
                }}>
                    <IconLink size={"1rem"} color="#e2e2e2" />
                </div>
                <Button children={"send"} className="text-xs" size="sm" type="submit" />
            </div>
        </form >
    )
}
export default TextInputArea