import './style.css'
import Borad from '../../components/board'
import { useLayout } from '../../context/page_schema';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useArea } from '../../Hooks/Area';

function Dashborad({ }: {}) {
  let { id } = useParams();
  let area = useArea(id);
  let { init } = useLayout();
  if (area) {
    useEffect(() => init(area.ui_schema), [])
    return (
      <main className='content flex flex-col'>
        <Borad />
      </main>
    )
  }
}
export default Dashborad
