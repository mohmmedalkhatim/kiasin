import { useParams } from 'react-router-dom';
import type { Area } from '../../../types/area';
import { useEffect, useState } from 'react';
import { useAreas } from '../../../context/para/areas';
import Layout from '../../../Layout';

function Area() {
  const { id } = useParams();
  const init = useAreas((state) => state.getArea);
  const active = useAreas((state) => state.active);
  const [done, setdone] = useState<boolean>(false);

  useEffect(() => {
    init(Number(id), setdone);
    console.log('active', active);
  }, []);
  if (done) {
    return (
      <main className="content">
        {active && active.at(-1) && <Layout area={active.at(-1) as Area} />}
      </main>
    );
  }
}
export default Area;
