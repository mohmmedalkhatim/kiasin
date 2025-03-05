import './style.css'
import Borad from '../../components/board'
import { invoke } from '@tauri-apps/api/core';
import { Area } from '../../types/area';
import { useQuery } from '@tanstack/react-query';

function Dashborad({ }: {}) {
  let { data, error, isLoading } = useQuery({
    queryKey: ['area'],
    queryFn: () => invoke<Area>('dashboard')
  })
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (data) {
    return <main className="content">
      <Borad area={data} />
    </main>
  }
}
export default Dashborad
