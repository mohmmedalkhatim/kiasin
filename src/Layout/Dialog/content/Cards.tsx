import { useAreas } from '../../../context/para/areas';

function Cards ({ id }: { id: number }) {
  let area = useAreas(state => state.active)?.at(-1)?.ui_schema;
  return (
    <div>
      {area?.item.map(item => (
        <div onClick={() => {
          
        }}>{item.type}</div>
      ))}
    </div>
  );
}
export default Cards;
