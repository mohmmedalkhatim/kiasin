import { IconLayersIntersect } from '@tabler/icons-react';
import Card from '../../../components/Cards/area_card';
import { useAreas } from '../../../context/para/areas';
import { useState } from 'react';
import { useDebounce } from 'react-use';
import { useLayoutDialog } from '../../../context/para/Dialog';

function AreasList ({ id }: { id: number }) {
  let list = useAreas(state => state.list);
  let get_card = useAreas(state => state.get_Card);
  let changeMode = useLayoutDialog(state=>state.changeMode)
  let [areas, setAreas] = useState<number[]>([]);
  useDebounce(
    () => {
      let card = get_card(id).props;
      setAreas(card.list);
    },
    20,
    [list]
  );
  return (
    <div className='p-4'>
      <div className='px-4 pb-2 flex items-center justify-between'>
        <div className=''>
          <div>areas</div>
          <div className='border'></div>
        </div>
        <div onClick={() => changeMode("dialog_areas",{id})}>
          <IconLayersIntersect />
        </div>
      </div>
      <div className='m_border  mb-3 '></div>
      <div className='boxs_grid'>
        {areas.map(item => (
          <Card key={item} id={item} />
        ))}
      </div>
    </div>
  );
}

export default AreasList;
