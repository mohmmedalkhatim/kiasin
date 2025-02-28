import { useParams } from "react-router-dom"
import { useArea } from "../../../Hooks/Area";
import Board from "../../../components/board";
import { useLayout } from "../../../context/page_schema";


function Area() {
  let { id } = useParams();
  let area = useArea(id)
  let init = useLayout(state => state.init)
  if (area) {
    init(area.ui_schema)
    return <main>
      <Board />
    </main>
  }
}
export default Area