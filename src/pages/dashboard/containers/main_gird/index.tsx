import { ReactElement, ReactNode } from "react"
import "./index.css"


type MainGridProps = {
    children?: ReactNode | ReactElement | ReactElement[];
    dense: boolean;
}



function MainGrid({ children, dense }: MainGridProps) {
    return (
        <div className={"main_grid_container"  + " grid_animation" + (dense ? " dense" : "")}>
            {children}
        </div>
    )
}
export default MainGrid
