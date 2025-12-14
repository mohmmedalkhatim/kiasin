import Dbs_Header from "./header"
import TableScreen from "./table_screen"
import DatabasesList from "./DatabasesList"
import { useState } from "react"
import "./style.css"


function Databases() {
    let [list] = useState([])
    let [active,setActive] =  useState("")
    
    return (
        <>
            <Dbs_Header />
            <main className="content mt-0 p-0 relative">
                <div className="flex w-full ">
                    <DatabasesList />
                    <TableScreen active="Area" />
                </div>
            </main>
        </>
    )
}
export default Databases