import { invoke } from "@tauri-apps/api/core";
import { Area } from "../types/area";
import { usePara } from "../context/para";


export function useArea(id: string | undefined): Area | null {
    let area = usePara.getState().areas.filter((value)=>value.id == id);
    return area[0]
}