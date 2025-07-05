import { useAreas } from '../../../../context/para/areas';

function TasksList () {
  const active = useAreas(state => state.active)?.at(-1);
  return <div>
    {active?.ui_schema.item.map((item)=>{
        if(item.type ==""){
            return(<div></div>)
        }
    })}
  </div>;
}
export default TasksList;
