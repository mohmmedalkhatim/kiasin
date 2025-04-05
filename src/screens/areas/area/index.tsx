import { useParams } from 'react-router-dom';
import type { Area } from '../../../types/area';
import { useEffect, useState } from 'react';
import { useAreas } from '../../../context/para/areas';
import Layout from '../../../Layout';
import { IconDots, IconDotsVertical, IconMenu, IconMenu2, IconMenu3, IconMenu4, IconMenuDeep, IconMenuOrder } from '@tabler/icons-react';

function Area() {
  const { id } = useParams();
  const init = useAreas((state) => state.getArea);
  const active = useAreas((state) => state.active);
  const [done, setdone] = useState<boolean>(false);

  useEffect(() => {
    init(Number(id), setdone);
  }, []);
  if (done) {
    return (
      <main className="content">
        {active && active.at(-1) && <Layout area={active.at(-1) as Area} />}
        <div className="fixed top-16 right-6"><IconDotsVertical size={"1.5rem"}/></div>
      </main>
    );
  }
}
export default Area;
