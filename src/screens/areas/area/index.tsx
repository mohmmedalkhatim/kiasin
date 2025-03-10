import { useParams } from "react-router-dom"
import Board from "../../../components/board";
import type { Area } from "../../../types/area";
import { act, useEffect, useState } from "react";
import { useAreas } from "../../../context/para/areas";



function Area() {
  let { id } = useParams();
  let init = useAreas(state => state.area)
  let active = useAreas(state => state.active);
  let [done, setdone] = useState<boolean>(false)

  useEffect(() => {
    init(Number(id), setdone)
  }, [])
  if (done) {
    console.log()
    return <main className="content">
      <Board area={active} />
    </main>
  }

}
export default Area