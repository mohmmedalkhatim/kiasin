import { ReactElement, ReactNode } from "react"
import "./index.css"
import { useSelector } from "react-redux";
import { RootState } from "../../../../contexts/store";


type MainGridProps = {
    children?: ReactNode | ReactElement | ReactElement[];
    dense: boolean;
}



function MainGrid({ children, dense }: MainGridProps) {
    let edit = useSelector((state: RootState) => state.area.active.edit)
    return (
        <div className={"main_grid_container"  + " grid_animation" + (dense ? " dense" : "")}>
            {children}
        </div>
    )
}
export default MainGrid
