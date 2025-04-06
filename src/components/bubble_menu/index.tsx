import { useRef, useState } from "react";
import { IconPlus } from "@tabler/icons-react";

function Cards_menu({ handleadding }: { handleadding: (s: string) => void }) {
    const [menu, setmenu] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    let change = (e: any) => {
        if (menuRef.current) {
            menuRef.current.style.left = `${e.pageX - 20}px`;
            menuRef.current.style.top = `${e.pageY - 12}px`;
            console.log("x :" + e.movementX + "y :" + e.movementY)
        }
        setmenu(!menu)
    }
    return (
        <>
            <div className="col-span-2 row-span-2 m_border flex justify-center items-center" onClick={change}>
                <button >
                    <IconPlus size={20} />
                </button>
            </div>
            <div ref={menuRef} className={`${menu ? "menu" : "hide"}`}>hello</div>
        </>
    )
}
export default Cards_menu