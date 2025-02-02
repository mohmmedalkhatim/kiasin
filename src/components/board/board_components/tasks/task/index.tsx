import Checkbox from "../../../../Checkbox"

function Task({title,state}:{title:string,state:boolean}) {
  return (
    <div className="m_border flex py-3 px-5 rounded justify-between items-center">
      <div>{title}</div>
      <Checkbox state={state} title=''/>
    </div>
  )
}
export default Task