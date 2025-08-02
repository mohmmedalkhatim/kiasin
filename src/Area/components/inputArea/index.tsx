import { useEffect, useState } from "react"
import { useAreas } from "../../../context/para/areas"

function TextInputArea({ id }: { id: number }) {
    let card = useAreas(state => state.get_Card)(id)
    let update = useAreas(state => state.update_card)
    let [content, setContent] = useState(card.props?.content || "")
    useEffect(() => {
        card.props = { content };
        update(id, card)
    }, [content])
    return (
        <form className="p-4 w-full h-full relative">
            <textarea className="focus:outline-none w-full h-full" placeholder="start writing" value={content} onChange={e => setContent(e.target.value)}/>
        </form >
    )
}
export default TextInputArea