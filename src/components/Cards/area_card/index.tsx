import { useEffect, useState } from 'react';
import { useAreas } from '../../../context/para/areas';
import { Link } from 'react-router-dom';
import { Area } from '../../../types/area';
import { IconTrash } from '@tabler/icons-react';

const AreaCard = ({ id }: { id: number }) => {
  const get_list_item = useAreas(state => state.get_list_item);
  const deleteArea = useAreas(state => state.delete_area);
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
      <div className='relative flex flex-col rounded-md m_border bg-clip-border text-gray-700'>
        <Link to={`/Area/${Area.id}`} viewTransition>
          <div
            style={{ backgroundImage: `url()` }}
            className='relative h-[6rem] overflow-hidden bg-blue-gray-500 bg-clip-border text-white  bg-gradient-to-r border-[#e2e2e220] border-b'
          ></div>
        </Link>
        <div className='px-4 py-3 flex items-center justify-between'>
          <Link to={`/Area/${Area.id}`} viewTransition>
            <h5 className='block text-md font-sans font-semibold leading-snug tracking-normal text-white antialiased'>
              {Area.title}
            </h5>
          </Link>
          <div onClick={() => deleteArea(Area.id)}>
            <IconTrash size={"1rem"} color='#e2e2e280' />
          </div>
        </div>
      </div>
    );
  }
};
export default AreaCard;
