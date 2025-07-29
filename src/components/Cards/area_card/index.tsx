import { useEffect, useState } from 'react';
import { useAreas } from '../../../context/para/areas';
import { Link } from 'react-router-dom';
import { Area } from '../../../types/area';
import { useDebounce } from 'react-use';

const AreaCard = ({ id }: { id: number }) => {
  const get_list_item = useAreas(state => state.get_list_item);
  const [Area, setArea] = useState<Area>();
  const list = useAreas(state => state.list);
  useEffect(
    () => {
      get_list_item(id, setArea);
    },
    [list]
  );
  if (Area) {
    return (
      <Link to={`/Area/${Area.id}`} viewTransition>
        <div className='relative flex flex-col rounded-md m_border bg-clip-border text-gray-700 shadow-md'>
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
      </Link>
    );
  }
};
export default AreaCard;
