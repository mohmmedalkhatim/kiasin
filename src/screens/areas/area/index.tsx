import { useParams } from "react-router-dom"
import type { Area } from "../../../types/area";
import { useEffect, useState } from "react";
import { useAreas } from "../../../context/para/areas";
import Layout from "../../../Layout";



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
      <Layout area={active} />
    </main>
  }

}
export default Area