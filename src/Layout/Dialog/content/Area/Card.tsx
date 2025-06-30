import { useState } from 'react';
import { useAreas } from '../../../../context/para/areas';
import { Area } from '../../../../types/area';
import { useDebounce } from 'react-use';

const AreaCard = ({ id, card_id }: { id: number; card_id: number }) => {
  const get_list_item = useAreas(state => state.get_list_item);
  const [Area, setArea] = useState<Area>({} as Area);
  const get_card = useAreas(state => state.get_Card);
  const update_card = useAreas(state => state.update_card);
  useDebounce(
    () => {
      get_list_item(id, setArea);
    },
    5,
    []
  );
  if (Area) {
    return (
      <div
        className='relative cursor-pointer flex flex-col rounded-md m_border bg-clip-border text-gray-700 shadow-md'
        onClick={() => {
            let card = get_card(card_id);
            card.props.list.push(id)
            update_card(card_id,card)
        }}
      >
        <div
          style={{ backgroundImage: `url()` }}
          className='relative h-[6rem] overflow-hidden bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r border-[#e2e2e220] border-b'
        ></div>
        <div className='px-4 py-3 flex items-center justify-between'>
          <h5 className='block text-md font-sans font-semibold leading-snug tracking-normal text-white antialiased'>
            {Area.title}
          </h5>
        </div>
      </div>
    );
  }
};
export default AreaCard;
