import { Channel, invoke } from "@tauri-apps/api/core";
import { Dispatch, SetStateAction } from "react";
import { create } from "zustand/react";


export interface DB {
    fields: string[]
    records: String[][];
}
export interface DB_DTO {
    id: number,
    name: string,
    data: DB,
    user_id: number,
}



interface database_context {
    list: DB_DTO[]
    create: (setDataBase?:Dispatch<SetStateAction<DB_DTO | undefined>>) => Promise<void>,
    init: () => Promise<void>,
    be_update: (id: number, data: DB_DTO) => Promise<void>,
    fe_update: (id: number, setDataBase: any) => Promise<void>,
    delete: (id: number) => Promise<void>,
    get: (id: number, setDataBase: any) => Promise<void>;
    get_list: (ids: number[], setDataBaseList: any) => Promise<void>;
}

export let useDatabase = create<database_context>((set) => ({
    list: [],
    create: async (set_db) => {
        let channel = new Channel<DB_DTO[]>((res) => {
            set_db?(res[0]):""
            set(state => ({ list: [...state.list, res[0]] }))
        })
        invoke("database_control", { payload: { command: "create" }, channel },)
    },
    init: async () => {
        let channel = new Channel<DB_DTO[]>((res) => {
            set(({ list: res }))
        })
        invoke("database_control", { payload: { command: "all" }, channel },)
    },
    be_update: async (id, data: DB_DTO) => {
        let channel = new Channel<DB_DTO[]>((res) => {
            set(state => {
                let filterd = state.list.filter(item => { return item.id != res[0].id });
                return { list: [...filterd, res[0]] };
            })
        })
        invoke("database_control", { payload: { command: "update", id, item: data }, channel })
    },
    fe_update: async () => { },
    delete: async () => { },
    get: async (id, setDataBase) => {
        let channel = new Channel<DB_DTO[]>((res) => {
            setDataBase(res[0])
            set(state => state)
        })
        invoke("database_control", { payload: { command: "one", id }, channel })
    },
    get_list: async (ids, setDataBaseList) => {
        let channel = new Channel<DB_DTO[]>((res) => {
            setDataBaseList(res)
        })
        invoke("database_control", { payload: { command: "get", ids }, channel })
        set(state => state)

    }
}))