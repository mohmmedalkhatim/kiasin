import { invoke } from "@tauri-apps/api/core"
import Database from "@tauri-apps/plugin-sql"



export class KiasinDBMS {
    db: Database = {} as Database;
    constructor() {
        invoke("Database", {}).then(res => {
            let create = URL.createObjectURL(new Blob([]))
            this.db = new Database("")
        })
    }
}