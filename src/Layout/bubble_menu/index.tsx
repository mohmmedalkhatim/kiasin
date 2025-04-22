import React, { useRef, useState } from "react";
import { IconCalendar, IconGrid4x4, IconList, IconPlus, IconSearch, IconWriting } from "@tabler/icons-react";
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

function Cards_menu({ handleadding }: { handleadding: (ele: element_props) => void }) {
    const [menu, setmenu] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const map = [
        {
            name: "Areaslist",
            props: {
                min_cols: 6,
                min_rows: 3,

            },
            content: [1, 2],
            icon: <IconGrid4x4 size={"1.7rem"} />
        },
        {
            name: "editor",
            props: {
                min_cols: 4,
                min_rows: 4,

            },
            content: "",
            icon: <IconWriting size={"1.7rem"} />
        },
        {
            name: "tasks",
            props: {
                min_cols: 2,
                min_rows: 3,
            },
            content: [],
            icon: <IconList size={"1.7rem"}/>
        },
        {
            name: "calender",
            props: {
                min_cols: 3,
                min_rows: 4,

            },
            content: [1, 2],
            icon: <IconCalendar size={"1.7rem"} />
        },
        {
            name: "calender",
            props: {
                min_cols: 3,
                min_rows: 4,

            },
            content: [1, 2],
            icon: <IconCalendar size={"1.7rem"} />
        },

    ]
    let change = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        menuRef.current?.focus()
        if (menuRef.current) {
            menuRef.current.style.left = `${e.pageX - 260}px`;
            menuRef.current.style.top = `${e.pageY - calculate_menu_appernce(e.pageY)}px`;
        }
        menuRef.current?.addEventListener("focusout",(e)=>{
            setmenu(!menu)
        })
        setmenu(!menu)
    }
    return (
        <>
            <div className="col-span-2 row-span-2 m_border transition-all duration-400 flex justify-center items-center" onClick={change}>
                <button >
                    <IconPlus size={20} />
                </button>
            </div>
            <div ref={menuRef} className={`${menu ? "menu" : "hidden"} z-1000`}>
                <div className="pt-4 px-4">
                    <Input placeholder="Search" icon={<IconSearch size={"1rem"} color="#e2e2e260" />} />
                </div>
                <nav className="elements_container">
                    {map.map((item) => (<div className="flex justify-center items-center" onClick={() => handleadding({ cols: item.props.min_cols, rows: item.props.min_rows, type: item.name, content: item.content })}>{item.icon}</div>))}
                </nav>
                <Button className="rounded-none border-none text-center text-xs" type="reset">
                    Browser All
                </Button>
            </div>
        </>
    )
}
export default Cards_menu