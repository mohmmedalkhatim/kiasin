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
        listen<Area[]>("areas", async e => {
            e.payload.map((item) => {
                console.log(item)
                let icon = URL.createObjectURL(new Blob([new Uint8Array(item.icon as number[])], { type: "image/jpeg" }))
                item.icon = icon
                let cover = URL.createObjectURL(new Blob([new Uint8Array(item.cover as number[])], { type: "image/jpeg" }))
                item.cover = cover
                set(state => ({ list: [...state.list, item] }))
            })
        })
        let res = invoke("areas_control", { command: "many" }).then((r) => { })
    },
    area: (id) => {

    },
    create: () => {
        invoke("areas_control", { payload: { command: "create" } });
    }

}))