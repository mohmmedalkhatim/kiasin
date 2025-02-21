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


