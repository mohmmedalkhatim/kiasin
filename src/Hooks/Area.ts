import { invoke } from "@tauri-apps/api/core";
import { Area } from "../types/area";


function useArea(id: string): Area | null {
    invoke<Area>("areas_control", { command: "retrive", payload: { id } }).then(res => {
        return res
    }).catch(e => { });
    return null

}