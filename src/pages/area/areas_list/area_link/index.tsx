import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { AppDispatch } from "../../../../contexts/store"
import { IconTrash } from "@tabler/icons-react"
import { delete_area } from "../../../../contexts/area/functions/delete"
import { Area } from "../../../../contexts/area"
import { Dispatch, SetStateAction } from "react";

type Props = {
  area: Area,
  Refresh: Dispatch<SetStateAction<boolean>>
}

function AreaLink({ area, Refresh }: Props) {
  let dispatch = useDispatch<AppDispatch>()

  return (
    <div className="area_link  border-border-main ">

      <Link to={`/area/${area.id}`} viewTransition className="w-full h-full grow">
        <div className=""></div>
      </Link>
      <div className="w-full border-t border-border-main p-3 flex items-center justify-between">
        <Link to={`/area/${area.id}`} viewTransition>
          <div className="">{area?.name}</div>
        </Link>
        <div onClick={() => { 
              Refresh(state => !state); 
              dispatch(delete_area(area.id));
            }}>
          <IconTrash size={"1rem"} />
        </div>
      </div>

    </div>
  )
}
export default AreaLink
