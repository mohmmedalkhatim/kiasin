import { useParams } from 'react-router-dom';
import type { Area } from '../../../types/area';
import { useEffect, useState } from 'react';
import { useAreas } from '../../../context/para/areas';
import Layout from '../../../Area';
import { IconDotsVertical } from '@tabler/icons-react';
import Header from '../../../Area/components/Area_Header';

function Area() {
  const { id } = useParams();
  const init = useAreas((state) => state.getArea);
  const active = useAreas((state) => state.active);
  const [done, setdone] = useState<boolean>(false);
  const editable = useAreas(state => state.editable);
  useEffect(() => {
    init(Number(id), setdone);
  }, [id]);
  if (done) {
    return (
      <>
        <Header />
        <main className={!editable ? "content" : "mt-[5rem] mr-[17rem]"}>
          {active && active.at(-1) && <Layout />}
          <div className="fixed top-16 right-6">
            <IconDotsVertical size={'1.5rem'} />
          </div>
        </main>
      </>
    );
  }
}
export default Area;
