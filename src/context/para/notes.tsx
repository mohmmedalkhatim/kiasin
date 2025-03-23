import { create } from "zustand";
import { Note } from "../../types/notes";
import { Channel, invoke } from "@tauri-apps/api/core";


interface Notes {
    list: Note[],
    active: Note[],
    area_notes: (area_id: number) => void,
    updata_note: (id: number, item: Note) => void,
    note:  (id: number,setDone:any) => Promise<void>
}

export let useNotes = create<Notes>((set) => ({
    list: [],
    active: [],
    area_notes: (id) => {
        let channel = new Channel<Note[]>()
        let list: Note[] = []
        channel.onmessage = (data) => {
            data.map((item) => list.push(item))
            set(({ list }))
        }
        invoke("notes_control", { payload: { command: "area_notes", id }, channel }).then((e) => { }).catch(e => {
            console.log(e);
        })

    },
    updata_note: (id, item) => {
        let channel = new Channel<Note[]>()
        set(state => {
            let list: Note[] = state.list.map(ele =>
                ele.id != String(id) ? ele : item
            );
            return ({ list })
        })
        invoke("notes_control", { payload: { command: "update_note", id }, channel }).then((e) => { }).catch(e => console.log(e))

    },
    note: async (id: number, setDone: any) => {
        let channel = new Channel<Note[]>();
        set(state => {
            let list = new Set(state.active);
            channel.onmessage = (data) => {
                list.add(data[0]);
                setDone(true)
            }
            return ({
                active: [...list]
            })
        })
        invoke("notes_control", { payload: { command: "find", id }, channel })
    }
}))