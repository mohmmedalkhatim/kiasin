import { useDispatch } from "react-redux"
import AreasList from "../area/areas_list"
import {  useState } from "react"
import { create_area_async_function } from "../../contexts/area/functions/create"
import Header from "../../components/header"
import { AppDispatch } from "../../contexts/store"
import Button from "../../components/Button";

function MainPage() {

    let dispatch = useDispatch<AppDispatch>()
      const [signle,setSignle] = useState(true)


    return (
        <div>
            <Header  >
                <div>Areas{signle}</div>
                <Button  onClick={() => {setSignle(!signle); dispatch(create_area_async_function())}}>create</Button>
        
            </Header>
            <AreasList reload={signle}/>
        </div>
    )
}
export default MainPage
