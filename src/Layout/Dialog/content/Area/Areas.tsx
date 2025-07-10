import { useAreas } from '../../../../context/para/areas';
import AreaCard from './Card';

function Areas ({ id }: { id: number }) {
  let active = useAreas(state => state.active)?.at(-1);
  let list = useAreas(state => state.list);
  let get_card = useAreas(state => state.get_Card);
  return (
    <div className='boxs_grid '>
      {list.map(item => {
        let card = get_card(id);
        if (
          item.id != active?.id &&
          !(card.props.list as number[]).includes(item.id)
        ) {
          return <AreaCard card_id={id} id={item.id}></AreaCard>;
        }
      })}
    </div>
  );
}
export default Areas;
