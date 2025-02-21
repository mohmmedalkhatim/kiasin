import Card from "./Card"

type Item = {
    name:string,
    url:string,
    image:string,
    id:string,
}


function List(props:{list:Item[]}) {
    return (
      <main className="content">
        <div className="boxs_grid">
            {props.list.map((item)=>(
                <Card {...item} />
            ))}
        </div>
      </main>
    )
  }
  
  export default List