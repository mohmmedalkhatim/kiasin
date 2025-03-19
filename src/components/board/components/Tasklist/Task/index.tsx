import Checkbox from "../../../../Checkbox"

function Task({id,classn}:{id:number,classn:string}) {
  return (
    <div className={`${classn} Task rounded-xs`}>
      <div>Task</div>
      <Checkbox state={false} title={""}/>
    </div>
  )
}
export default Task