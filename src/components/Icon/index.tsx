import { ReactElement } from "react"

function Icon({svg}:{svg:ReactElement}) {
  return (
    <div className="p-3">
        {svg}
    </div>
  )
}
export default Icon