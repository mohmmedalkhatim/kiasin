import { Channel, invoke } from "@tauri-apps/api/core";
import { create } from "zustand/react";


interface DB {
    fields: string[]
    data: Iterable<readonly [string, { type: string, value: any }[]]>;
}
interface DB_DTO {
    id: number,
    name: String,
    data: DB,
    user_id: number,
}

export class Database {
    fields: string[] = []
    data: Map<string, { type: any, value: any }[]> = new Map()
    constructor(id: number) {
        invoke('database_control', { command: "get", id })
        new Channel<DB_DTO>(res => {
            console.log(id)
            this.fields = res.data.fields
            this.data = new Map<string, { type: any, value: any }[]>(res.data.data)
        })

    }
    stringify(): string {
        let list: any[][] = []
        this.data.forEach((key, item) => {
            list.push([key, item])
        })
        return JSON.stringify({ fields: this.fields, data: list });
    }
    add_field(name: string): string {
        this.data.set(name, [])
        return this.stringify();
    }
    delete_field(name: string): string {
        this.data.delete(name)
        return this.stringify();
    }
    update_field(): string {
        return this.stringify()
    }
    add_record(field: string, value: { type: any, value: any }) {
        let list = this.data.get(field);
        if (list) {
            list.push(value)
            this.data.set(field, list);
        }
        return this.stringify();

    }
    update_record(field: string, index: number, value: { type: any, value: any }) {
        let list = this.data.get(field);
        if (list) {
            list[index] = value;
            this.data.set(field, list);
        }
        return this.stringify();
    }
    delete_record(field: string, index: number,) {
        let list = this.data.get(field);
        if (list) {
            let updated_list = list.map((value, key) => {
                if (key !== index) {
                    return value
                }
            })
            if (updated_list) {
                this.data.set(field, updated_list as { type: any, value: any }[]);
            }
        }
        return this.stringify();
    }
}

interface database_context {
    list: DB_DTO[]
    create: (id: number, setDataBase: any) => Promise<void>,
    be_update: (id: number, data: DB_DTO) => Promise<void>,
    fe_update: (id: number, setDataBase: any) => Promise<void>,
    delete: (id: number) => Promise<void>,
    get: (id: number, setDataBase: any) => Promise<void>;
    get_list: (ids: number[], setDataBaseList: any) => Promise<void>;
}

let useDatabase = create<database_context>((set) => ({
    list: [],
    create: async () => {
        let channel = new Channel<DB_DTO>((res) => {
            set(state => ({ list: [...state.list, res] }))
        })
        invoke("database_control", { payload: { command: "create" }, channel },)
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
        })
        invoke("database_control", { payload: { command: "get", id }, channel })
    },
    get_list: async (ids, setDataBaseList) => {
        let channel = new Channel<DB_DTO[]>((res) => {
            setDataBaseList(res)
        })
        invoke("database_control", { payload: { command: "get", ids }, channel })
    }
}))