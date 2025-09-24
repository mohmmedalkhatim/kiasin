import { useDatabase } from "../../context/para/database"
import DbCard from "./DbCard"
import Dbs_Header from "./header"

function Databases() {
    let list = useDatabase(state => state.list)
    return (
        <>
            <Dbs_Header />
            <div className="content p-8 boxs_grid">{
                list.map(item => {
                    console.log(item)
                    return (<DbCard key={item.id} name={item.name} id={item.id} />)
                })
            }
            </div>
        </>
    )
}
export default Databases