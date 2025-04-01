import AreaCard from '../../components/Cards/area_card';
import { IconPlus } from '@tabler/icons-react';
import { useAreas } from '../../context/para/areas';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAside } from '../../context/aside';

function Areas() {
  const init = useAreas((state) => state.init);
  const list = useAreas((state) => state.list);
  const toggle = useAside((state) => state.toggle);
  useEffect(() => {
    init();
  }, []);
  return (
    <main className="content">
      <div className="boxs_grid">
        {list.map((item) => {
          return (
            <Link to={`/Area/${item.id}`} key={item.id}>
              <AreaCard id={item.id} />
            </Link>
          );
        })}
        <button
          className="flex items-center justify-center"
          onClick={() => toggle()}
        >
          <IconPlus />
        </button>
      </div>
    </main>
  );
}

export default Areas;
