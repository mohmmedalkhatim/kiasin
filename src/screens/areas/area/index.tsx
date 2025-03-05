import { useParams } from "react-router-dom"
import Board from "../../../components/board";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import type { Area } from "../../../types/area";
import { listen } from "@tauri-apps/api/event";
import { useState } from "react";


async function getArea(id: number, setArea: React.Dispatch<React.SetStateAction<Area | undefined>>) {
  let area = {} as Area;
  await listen<Area>("area", e => {
    area = e.payload
    setArea(e.payload)
  })
  invoke("areas_control", { payload: { command: "one", id } })
  return area
}

function Area() {
  let { id } = useParams();
  let [area, setAreas] = useState<Area>()
  let { data, error, isLoading } = useQuery({
    queryKey: ['area', id, area],
    queryFn: () => getArea(Number(id), setAreas)
  })
  if (isLoading) return <main className="content">Loading...</main>
  if (error) return <main className="content">Error: {error.message}</main>
  if (data) {
    return <main className="content">
      <Board area={area} />
    </main>
  } else {
    return <main className="content">Error</main>
  }

}
export default Area