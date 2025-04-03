import { Channel, invoke } from "@tauri-apps/api/core";
import { create } from "zustand";
import { Area } from "../../types/area";

interface templates_action {
    list: Area[]
    create_template_form_area: (id: number) => void,
    update: (id: number) => void,
}

export let useTemplates = create<templates_action>((set) => ({
    list: [],
    init: () => {
        let channel = new Channel<Area[]>()
        channel.onmessage = (data) => {
            set(({ list: data }))
        }
        invoke("templates_control", { payload: { command: "find" }, channel })
    },
    create_template_form_area: (id) => {
        let channel = new Channel<Area[]>()
        channel.onmessage = (data) => {
            set(state => ({ list: [...state.list, data[0]] }))
        }
        invoke("templates_control", { payload: { command: "create", id }, channel })
    },
    update: (id) => {
        let channel = new Channel<Area[]>()
        channel.onmessage = (data) => {
            set(state => ({ list: [...state.list, data[0]] }))
        }
        invoke("templates_control", { payload: { command: "create", id }, channel })
    }
}))