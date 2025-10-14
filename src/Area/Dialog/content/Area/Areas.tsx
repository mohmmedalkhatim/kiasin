import { IconPlus } from '@tabler/icons-react';
import { useAreas } from '../../../../context/para/areas';
import AreaCard from './Card';

function Areas ({ id }: { id: number }) {
  let active = useAreas(state => state.active)?.at(-1);
  let list = useAreas(state => state.list);
  let get_card = useAreas(state => state.get_Card);
  let create =  useAreas(state=>state.create)
  return (
    <div className='boxs_grid p-8'>
      {list.map(item => {
        let card = get_card(id);
        if (
          item.id != active?.id &&
          !(card.props.list as number[]).includes(item.id)
        ) {
          return <AreaCard card_id={id} id={item.id}></AreaCard>;
        }
      })}
      <div className='flex items-center justify-center m_border' onClick={()=>create(1)}>
        <IconPlus/>
      </div>
    </div>
  );
}
export default Areas;
