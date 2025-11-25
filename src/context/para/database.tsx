import { create } from "zustand";
import { DB } from "../../main";
import { Dispatch, SetStateAction } from "react";

export type tableInfo = { name: string, tbl_name: string, type: string, rootpage: number, sql: string }


export type DatabaseType = {
    name: string,
    info: rowInfo[],
    data: unknown[]
}
type rowType = "INTEGER" | "varchar" | "varbinary_blob" | "date_text" | "boolean" | "json_text"
type rowInfo = {
    cid: 0 | 1
    dflt_value: null | string
    name: string
    notnull: 1 | 0
    pk: 1 | 0
    type: rowType
}

interface DatabaseContextType {
    databases: DatabaseType[];
    activeDatabase: DatabaseType | null;
    setActiveDatabase: (name: string) => Promise<void>;
    reloadDatabase: (name: string) => Promise<void>;
    setDatabase: (db: DatabaseType) => void;
    findOne: (name: string, setDB: Dispatch<SetStateAction<DatabaseType | undefined>>) => Promise<void>
    init: () => Promise<void>,
}

export const useDatabase = create<DatabaseContextType>((set) => ({
    databases: [],
    activeDatabase: null,
    init: async () => {
        let tables = await DB.select("SELECT * from sqlite_master WHERE type='table';") as tableInfo[]
        tables.map(async (value) => {
            let info = await tableInfo(value.name)
            DB.select<unknown[]>(`SELECT * from ${value.name}`,).then((res) => {
                set(state => {
                    let filtered = state.databases.filter(item=>item.name != value.name).sort();
                    return {
                        databases: [...filtered, {
                            name: value.name,
                            info,
                            data: res
                        }]
                    }
                })
            })
        })

    },
    findOne: async (name, setdatabase) => {
        let info = await tableInfo(name)
        DB.select<unknown[]>(`SELECT * from ${name}`).then((res) => {
            setdatabase({
                name,
                info,
                data: res
            })
        })
    },
    setActiveDatabase: async (name: string) => {

    },
    reloadDatabase: async (name: string) => {

    },
    setDatabase: () => { },
}))

async function tableInfo(name: string): Promise<rowInfo[]> {
    let info = await DB.select(`PRAGMA table_info(${name})`, [name]) as rowInfo[];
    return info
}