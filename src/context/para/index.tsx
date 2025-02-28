import { create } from "zustand";
import { listen } from '@tauri-apps/api/event';
import { Area } from "../../types/area";
import { Project } from "../../types/project";
import { Resource } from "../../types/resource";

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
        listen<Area[]>("areas", e => {
            let areas = e.payload.map((item)=>{
                if(typeof item.cover  == "object"){
                    let a = new Uint8Array(item.cover); 
                    
                }
                let icon  = URL.createObjectURL(new Blob(a,{type:"image/jpeg"}))
                let cover  = URL.createObjectURL(new Blob([],{type:"image/jpeg",}))
                return()
            })
            set({ areas: e.payload })
        })
        listen<Project[]>("projects", e => {
            set({ projects: e.payload })
        })
        listen<Resource[]>("resources", e => {
            set({ resources: e.payload })
        })
    }

}))


