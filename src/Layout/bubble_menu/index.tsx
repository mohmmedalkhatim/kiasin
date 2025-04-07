import React, { EventHandler, useRef, useState } from "react";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { element_props } from "..";
import Button from "../../components/Button";
import Input from "../../components/Input";



const calculate_menu_appernce = (y: number): number => {
    let pos = 0;
    if (y <= 300) {
        pos = 72
    } else {
        pos = 260
    }
    return pos
}

function Cards_menu({ handleadding }: { handleadding: (ele:element_props) => void }) {
    const [menu, setmenu] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const map = [

    ]
    let change = (e: any) => {

        if (menuRef.current) {
            menuRef.current.style.left = `${e.pageX - 260}px`;
            menuRef.current.style.top = `${e.pageY - calculate_menu_appernce(e.pageY)}px`;
            console.log(e.pageY)
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
            <div ref={menuRef} className={`${menu ? "menu" : "hide"} z-1000`}>
                <div className="p-4">
                    <Input placeholder="Search" icon={<IconSearch size={"1rem"} color="#e2e2e260"/>}/>
                </div>
                <nav className="elements_container">

                </nav>
                <Button className="rounded-none border-none text-center text-xs" type="reset">
                    Browser All
                </Button>
            </div>
        </>
    )
}
export default Cards_menu