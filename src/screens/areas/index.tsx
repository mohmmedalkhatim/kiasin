import AreaCard from '../../components/Cards/area_card';
import { IconPlus } from '@tabler/icons-react';
import { useAreas } from '../../context/para/areas';
import { useAside } from '../../context/aside';

function Areas() {
  const list = useAreas((state) => state.list);
  const toggle = useAside((state) => state.toggle);
  return (
    <main className="content">
      <div className="boxs_grid">
        {list.map((item) => {
          return (
              <AreaCard id={item.id} />
          );
        })}
        <button
          className="flex items-center justify-center"
          onClick={() => toggle('areas')}
        >
          <IconPlus />
        </button>
      </div>
    </main>
  );
}

export default Areas;
