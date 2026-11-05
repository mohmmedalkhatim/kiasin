import { useDispatch } from "react-redux"
import AreasList from "../area/areas_list"
import {  useState } from "react"
import { create_area_async_function } from "../../contexts/area/functions/create"
import Header from "../../components/header"
import { AppDispatch } from "../../contexts/store"
import Button from "../../components/Button";

function MainPage() {
    let dispatch = useDispatch<AppDispatch>()
    const [reload, setReload] = useState(true)
    return (
        <div>
            <Header>
                <h1 className="text-xl font-semibold">Areas</h1>
                <Button onClick={() => {
                    setReload(!reload)
                    dispatch(create_area_async_function())
                }}>
                    Create Area
                </Button>
            </Header>
      <AreasList reload={reload}/>
        </div>
    )
}
export default MainPage
