import Card from "../../components/List/Card"



function List(props:{list:[]}) {
  return (
    <main className="content">
      <div className="boxs_grid">
        <Card image={""} id={"0"} />
        <Card image={""} id={"1"} />
        <Card image={""} id={"2"} />
      </div>
    </main>
  )
}

export default List