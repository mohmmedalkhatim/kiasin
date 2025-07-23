import { IconEdit } from "@tabler/icons-react"
import { useBubbleMenu } from "../context/para/BubbleMenu"
import { useEffect, useRef } from "react"
import "./style.css"
function BubbleMenu() {
    let opened = useBubbleMenu(state => state.opened)
    let toggle = useBubbleMenu(state => state.toggle)
    let open = useBubbleMenu(state => state.open)
    let close = useBubbleMenu(state => state.close)
    let ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        document.addEventListener("contextmenu", e => {
            if (opened) {
                close()
            }
            e.preventDefault()
            ref.current?.focus()
            if (ref.current) {
                ref.current.style.top = `${e.y}px`
                ref.current.style.left = `${e.x}px`
            }
            setTimeout(open, 200)
        })
        ref.current?.addEventListener("focusout", () => {
            close()
        })
    }, [])
    return (
        <div className="m_border bubble_menu" ref={ref} style={{ display: opened ? "flex" : "none" }}>
            <div className="m_border bubble_menu_item" onClick={()=>{}}>edit <IconEdit  size={"1rem"}/></div>

        </div>
    )
}
export default BubbleMenu