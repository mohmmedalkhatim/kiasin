import Card from "../../components/List/Card"
import { IconPlus } from '@tabler/icons-react';
import { useAreas } from "../../context/para/areas";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { Area } from "../../types/area";
import { useState } from "react";

async function getAreas(list:React.Dispatch<React.SetStateAction<Area[]>>) {
  console.log("hello")
  let lis: Area[] = []
  invoke("areas_control", { payload: { command: "many" } })
  await listen<Area[]>("areas", e => {
    list(e.payload)
  })
  return lis
}

function Areas() {
  let [areas, setAreas] = useState<Area[]>([])
  let create = useAreas(state => state.create)
  let { data, isError, isLoading,error } = useQuery({
    queryKey: ["areas",areas],
    queryFn: ()=> getAreas(setAreas)
  })
  if (data) {
    return (
      <main className="content">
        <div className="boxs_grid">
          {areas.map((item) => {
            return (
              <Link to={`/Area/${item.id}`} key={item.id}>
                <Card image={item.cover as string} id={String(item.id)} />
              </Link>
            )
          })}
          <button className="flex items-center justify-center" onClick={create}>
            <IconPlus />
          </button>
        </div>
      </main>
    )
  }
  if(isError){
    return <main className="content"> some{error?.name}</main>
  }
  if(isLoading){
    return <main className="content">loading</main>
  }
}


export default Areas