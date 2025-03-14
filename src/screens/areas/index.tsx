import Card from "../../components/Card"
import { IconPlus } from '@tabler/icons-react';
import { useAreas } from "../../context/para/areas";
import { Link } from "react-router-dom";
import { useEffect } from "react";


function Areas() {
  let init = useAreas(state => state.init);
  let list = useAreas(state => state.list);
  let create = useAreas(state => state.create)
  useEffect(() => {
    init()
  },[])
    return (
      <main className="content">
        <div className="boxs_grid">
          {list.map((item) => {
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


export default Areas