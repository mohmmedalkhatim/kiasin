import './style.css'
import Borad from '../../components/board'
import { invoke } from '@tauri-apps/api/core';
import { Area } from '../../types/area';
import { useQuery } from '@tanstack/react-query';

function Dashborad({ }: {}) {
  let { data, error, isLoading } = useQuery({
    queryKey: ['area'],
    queryFn: async () => await invoke<Area>('dashboard')
  })
  if (isLoading) return <main className='content'>Loading...</main>
  if (error) return <main  className='content'>Error: {error.message}</main>
  if (data) {
    return <main className="content">
      <Borad area={data} />
    </main>
  }
}
export default Dashborad
