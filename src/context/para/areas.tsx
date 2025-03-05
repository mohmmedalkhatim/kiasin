import { create } from "zustand";
import { Area } from "../../types/area";
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

interface Areas {
    list: Area[],
    active: Area | undefined
    init: () => void
    area: (id: number) => void
    create: () => void
}


export let useAreas = create<Areas>((set) => ({
    list: [],
    active: undefined,
    init: () => {
        listen<Area[]>("area", e => {
            console.log("hello");
            e.payload.map((item) => {
                let icon = URL.createObjectURL(new Blob([new Uint8Array(item.icon as number[])], { type: "image/jpeg" }))
                item.icon = icon;
                let cover = URL.createObjectURL(new Blob([new Uint8Array(item.cover as number[])], { type: "image/jpeg" }))
                item.cover = cover;
                let list = new Set(e.payload)
                list.add(item)
                set(state => ({ list: [...list] }))
            })
        })
        let res = invoke("areas_control", { payload: { command: "many" } });
    },
    area: (id) => {
        set(state=>({active:state.list.filter((item)=>item.id == id)[0]}))
    },
    create: () => {
        invoke("areas_control", { payload: { command: "create" } });
        let res = invoke("areas_control", { payload: { command: "many" } });
    }


}))