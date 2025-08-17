import { IconLayersIntersect } from '@tabler/icons-react';
import Card from '../../../components/Cards/area_card';
import useAreaList from './hook';

function AreasList({ id }: { id: number }) {
  let { areas, update_card, card, changeMode } = useAreaList(id)
  if (areas) {
    return (
      <div className='p-4'>
        <div className='px-4 pb-2 flex items-center justify-between'>
          <div className=''>
            <input
              className='outline-none border-none focus:border p-0 text-sm'
              placeholder='untitled'
              value={card.props.name} onChange={(e) => update_card(id, { ...card, props: { ...card.props, name: e.target.value } })}></input>
          </div>
          <div onClick={() => changeMode("dialog_areas", { id })}>
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
}

export default AreasList;
