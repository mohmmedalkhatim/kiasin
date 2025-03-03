import { create } from "zustand";
import { Project } from "../../types/project";
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

interface Projects {
    list: Project[],
    active: Project | undefined
    init: () => void
    area: (id: number) => void
    create: () => void
}


export let useAreas = create<Projects>((set) => ({
    list: [],
    active: undefined,
    init: () => {
        listen<Project[]>("areas", async e => {
            e.payload.map((item) => {
                console.log(item)
                let icon = URL.createObjectURL(new Blob([new Uint8Array(item.icon as number[])], { type: "image/jpeg" }))
                item.icon = icon
                let cover = URL.createObjectURL(new Blob([new Uint8Array(item.cover as number[])], { type: "image/jpeg" }))
                item.cover = cover
                set(state => ({ list: [...state.list, item] }))
            })
        })
        let res = invoke("projects_control", { command: "many" }).then((r) => { })
    },
    area: (id) => {

    },
    create: () => {
        invoke("projects_control", { payload: { command: "create" } });
    }

}))
