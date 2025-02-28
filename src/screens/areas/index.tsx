import Card from "../../components/List/Card"
import { useLayout } from "../../context/page_schema"
import { usePara } from "../../context/para"



function Areas(props: { list: [] }) {
  let areas = usePara(state => state.areas)
  return (
    <main className="content">
      <div className="boxs_grid">
        {areas.map((item) => {
        
          return (<Card image={item.cover} />)
        })}
        <Card image={""} id={"0"} />
        <Card image={""} id={"1"} />
        <Card image={""} id={"2"} />
      </div>
    </main>
  )
}

export default Areas