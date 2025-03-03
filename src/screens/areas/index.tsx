import Card from "../../components/List/Card"
import {IconPlus} from '@tabler/icons-react';
import { useAreas } from "../../context/para/areas";


function Areas(props: { list: [] }) {
  let create = useAreas(state=>state.create)
  let list = useAreas(state=>state.list)
  return (
    <main className="content">
      <div className="boxs_grid">
        {list.map((item) => {
          return (<Card image={item.cover as string} id={item.id} />)
        })}
        <Card image={""} id={"0"} />
        <Card image={""} id={"1"} />
        <Card image={""} id={"2"} />
        <button className="" onClick={create}>
          <IconPlus />
        </button>
      </div>
    </main>
  )
}

export default Areas