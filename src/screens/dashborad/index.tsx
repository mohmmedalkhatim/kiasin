import { useEffect, useState } from 'react'
import './style.css'
import Card from '../../components/Card'
import DashHeader from './header'
import Status from './statusbox'

function Dashborad () {
  let [media, setmedia] = useState()
  let status = [
    { name: 'projects', count: 1 },
    { name: 'tasks', count: 1 },
    { name: 'complated project', count: 1 },
    { name: 'complated Task', count: 1 }
  ]
  useEffect(() => {}, [])
  return (
    <main className='h-[45rem] m_grid'>
      <DashHeader />
      <div className='col-span-9 row-span-2 flex gap-8 px-8  rounded-sm'>
        {status.map(({ name, count }) => (
          <Status name={name} count={count} />
        ))}
      </div>
      <div className='col-span-3 m_border row-span-9'></div>
      <div className='lg:area_grid'>
        <Card image={''}></Card>
        <Card image={''}></Card>
        <Card image={''}></Card>
        <Card image={''}></Card>
        <Card image={''}></Card>
        <Card image={''}></Card>
      </div>
    </main>
  )
}
export default Dashborad
