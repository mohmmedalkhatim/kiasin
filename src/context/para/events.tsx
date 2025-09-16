import { Channel, invoke } from "@tauri-apps/api/core";
import { create } from "zustand";


interface Events_context {
    list: Event[],
    init: () => void
    get_list: () => void,
    get_one: () => void,
    create: () => void,
    update: () => void,
}


export interface Event {
    id: number,
    title: string,
    start: string,
    end: string,
    created: string,
    description: string
    user_id: number,
}


export let useEvents = create<Events_context>((set) => ({
    list: [],
    init: () => {
        let channel = new Channel<Event[]>((list) => {
            set({ list })
        })
        invoke("events_control", { payload: { command: "all" }, channel })
    },
    get_list: () => { },
    get_one: () => { },
    create: () => { },
    update: () => { },
}))