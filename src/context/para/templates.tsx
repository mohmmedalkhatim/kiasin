import { Channel, invoke } from "@tauri-apps/api/core";
import { create } from "zustand";
import { Area } from "../../types/area";

interface templates_action {
    list: Area[]
    create_template_form_area: (id: number) => void,
    update: (id: number) => void,
    get_list_item:(id:number)=>Area
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
    get_list_item: (id) => {
        let s = {} as Area;
        set((state) => {
          s = state.list.filter((item) => item.id == id)[0];
          return { ...state }; // Ensure the function returns the updated state
        });
        return s;
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