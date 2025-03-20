import { create } from "zustand";
import { Note } from "../../types/notes";
import { Channel, invoke } from "@tauri-apps/api/core";


interface Notes {
    list: Note[],
    area_notes: (area_id: number) => void,
    updata_note: (id: number, item: Note) => void,
    note: (id: number) => void
}

let useNote = create<Notes>((set) => ({
    list: [],
    area_notes: (id) => {
        let channel = new Channel<Note[]>()
        let list: Note[] = []
        channel.onmessage = (data) => {
            data.map((item) => list.push(item))
            set(({list}))
        }
        invoke("notes_control", { payload: { command: "area_notes", id }, channel }).then((e) => { })
        
    },
    updata_note: (id, item) => {

    },
    note: (id: number) => { }
}))