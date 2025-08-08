import { useEffect, useState } from "react"
import { useAreas } from "../../../context/para/areas"
import { JSONContent } from '@tiptap/react';
import { useNotes } from "../../../context/para/notes";
import Button from "../../../components/Button";
import { IconLink } from "@tabler/icons-react";
import { useLayoutDialog } from "../../../context/para/Dialog";

function TextInputArea({ id }: { id: number }) {
    const card = useAreas(state => state.get_Card)(id)
    const update = useAreas(state => state.update_card)
    const [content, setContent] = useState(card.props?.content || "")
    const dialog = useLayoutDialog(state => state.changeMode)
    const active = useAreas(state => state.active)?.at(-1)
    const note = useNotes(state => state.updata_note)
    useEffect(() => {
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
        if (card.props.link) {

        } else {

        }
        card.props = { ...card.props, content };
        update(id, card)
    }, [content])
    return (
        <form className="p-4 w-full h-full relative" onSubmit={(e)=>e.preventDefault()}>
            <textarea className="focus:outline-none w-full h-full" placeholder="start writing" value={content} onChange={e => setContent(e.target.value)} />
            <div className="absolute flex items-center gap-4 right-4 bottom-4">
                <div onClick={() => {
                    dialog("dialog_links", { id })
                }}>
                    <IconLink size={"1rem"} color="#e2e2e2" />
                </div>
                <Button children={"send"} className="text-xs" size="sm" type="submit" />
            </div>
        </form >
    )
}
export default TextInputArea