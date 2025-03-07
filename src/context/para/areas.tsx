import { create } from "zustand";
import { Area } from "../../types/area";
import { Channel, invoke } from '@tauri-apps/api/core';

interface Areas {
    list: Area[],
    active: Area | undefined
    init: () => void
    area: (id: number, setArea: React.Dispatch<React.SetStateAction<boolean>>) => void
    create: () => void
}


export let useAreas = create<Areas>((set) => ({
    list: [],
    active: undefined,
    init: () => {
        let channel = new Channel<Area[]>();
        channel.onmessage = (data) => {
            data.map((item) => {
                let icon = URL.createObjectURL(new Blob([new Uint8Array(item.icon as number[])], { type: "image/jpeg" }))
                item.icon = icon;
                let cover = URL.createObjectURL(new Blob([new Uint8Array(item.cover as number[])], { type: "image/jpeg" }))
                item.cover = cover;
                let list = new Set<Area>(data)
                list.add(item)
                set(state => ({ list: [...list] }))
            })
        }
        return invoke("areas_control", { payload: { command: "many" }, channel });
    },
    area: (id, setarea) => {

        set(state => {
            let area = state.list.filter((item) => item.id == id)[0]
            return { active: area }
        })
        setarea(true)
    },
    create: () => {
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
    }
}))