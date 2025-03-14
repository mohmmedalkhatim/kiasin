import Card from "../Card"


function AreasList(props:{list:number[]}) {
    return (
      <div>
        <div className="boxs_grid">
            {props.list.map((item)=>(
                <Card key={item} id={item} />
            ))}
        </div>
      </div>
    )
  }
  
  export default AreasList