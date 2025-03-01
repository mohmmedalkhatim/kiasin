import { create } from "zustand";
import { listen } from '@tauri-apps/api/event';
import { Area } from "../../types/area";
import { Project } from "../../types/project";
import { Resource } from "../../types/resource";
import { invoke } from "@tauri-apps/api/core";

interface Para {
    projects: Project[]
    areas: Area[],
    resources: Resource[],
    init: () => void
}
export let usePara = create<Para>((set) => ({
    projects: [],
    areas: [],
    resources: [],
    init: async () => {
        console.log("init")
        listen<Area[]>("areas",async e => {
            let res = await invoke("areas", { command: "many" }).then((r)=>{
                console.log(r)
            })

            e.payload.map((item) => {
                console.log(item)
                if (typeof item.cover == "object") {
                    let icon = URL.createObjectURL(new Blob([new Uint8Array(item.cover)], { type: "image/jpeg" }))
                    item.icon = icon
                }

                if (typeof item.icon == "object") {
                    let cover = URL.createObjectURL(new Blob([new Uint8Array(item.icon)], { type: "image/jpeg" }))
                    item.cover = cover
                }
                set(state => ({ areas: [...state.areas, item] }))
            })
        })
        listen<Project[]>("projects", e => {
            e.payload.map((item) => {
                if (typeof item.cover == "object") {
                    let icon = URL.createObjectURL(new Blob([new Uint8Array(item.cover)], { type: "image/jpeg" }))
                    item.icon = icon
                }

                if (typeof item.icon == "object") {
                    let cover = URL.createObjectURL(new Blob([new Uint8Array(item.icon)], { type: "image/jpeg" }))
                    item.cover = cover
                }
                set(state => ({ projects: [...state.projects, item] }))
            })
        })
        listen<Resource[]>("resources", e => {
            e.payload.map((item) => {
                if (typeof item.cover == "object") {
                    let icon = URL.createObjectURL(new Blob([new Uint8Array(item.cover)], { type: "image/jpeg" }))
                    item.icon = icon
                }

                if (typeof item.icon == "object") {
                    let cover = URL.createObjectURL(new Blob([new Uint8Array(item.icon)], { type: "image/jpeg" }))
                    item.cover = cover
                }
                set(state => ({ resources: [...state.resources, item] }))
            })
        })
    }

}))


