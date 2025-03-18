import { create } from "zustand";
import { Area } from "../../types/area";
import { Channel, invoke } from '@tauri-apps/api/core';

interface Areas {
    list: Area[],
    active: Area | undefined
    editable: boolean
    init: () => void
    area: (id: number, setArea: React.Dispatch<React.SetStateAction<boolean>>) => void
    create: (id:number) => void
    update: (area: Area) => void
    taggleEditable: () => void
    getArea:(id:number)=>Area
}


export let useAreas = create<Areas>((set) => ({
    list: [],
    active: undefined,
    editable: false,
    taggleEditable: () => {
        set(state => ({ editable: !state.editable }))  
    },
    init: () => {
        let channel = new Channel<Area[]>();
        channel.onmessage = (data) => {
            data.map((item) => {
                console.log("area", item);
                let icon = URL.createObjectURL(new Blob([new Uint8Array(item.icon as number[])], { type: "image/jpeg" }))
                item.icon = icon;
                let cover = URL.createObjectURL(new Blob([new Uint8Array(item.cover as number[])], { type: "image/jpeg" }))
                item.cover = cover;
                let list = new Set<Area>(data)
                list.add(item)
                set(state => ({ list: [...list] }))
            })
        }
        return invoke("areas_control", { payload: { command: "find" }, channel });
    },
    area: (id, setarea) => {

        set(state => {
            let area = state.list.filter((item) => item.id == id)[0]
            return { active: area }
        })
        setarea(true)
    },
    create: (id:number) => {
        let channel = new Channel<Area[]>();
        invoke("areas_control", { payload: { command: "create" }, channel });
        channel.onmessage = (data) => {
            data.map((item) => {
                let icon = URL.createObjectURL(new Blob([new Uint8Array(item.icon as number[])], { type: "image/jpeg" }))
                item.icon = icon;
                let cover = URL.createObjectURL(new Blob([new Uint8Array(item.cover as number[])], { type: "image/jpeg" }))
                item.cover = cover;
                set(state => ({ list: [...state.list, item] }))
            })
        }
    },
    getArea:(id)=>{
        let area:Area|undefined;
        set(state=>{
            area = state.list.find(item=>item.id == id);
            return(state)
        })
        return area as Area

    },
    update: (area: Area) => {
        let channel = new Channel<Area[]>();
        channel.onmessage = (data) => {
            data.map((item) => {
                let icon = URL.createObjectURL(new Blob([new Uint8Array(item.icon as number[])], { type: "image/jpeg" }))
                item.icon = icon;
                let cover = URL.createObjectURL(new Blob([new Uint8Array(item.cover as number[])], { type: "image/jpeg" }))
                item.cover = cover;
                set(state => ({ list: [...state.list.filter((item) => item.id != area.id), item] }))
            })
        }
        invoke("areas_control", { payload: { command: "update", id:area.id, item:area }, channel });
    }
}))