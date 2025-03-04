import { useParams } from "react-router-dom"
import Board from "../../../components/board";
import { useLayout } from "../../../context/page_schema";
import { useAreas } from "../../../context/para/areas";


function Area() {
  let { id } = useParams();
  let init = useLayout(state => state.init)
  return <main>
    <Board />
  </main>
}
export default Area