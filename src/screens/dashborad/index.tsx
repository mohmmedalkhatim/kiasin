import { useEffect, useState } from 'react'
import './style.css'
import Card from '../../components/Card'


function Dashborad () {
  let [media, setmedia] = useState()
  useEffect(() => {}, [])
  return (
    <main className='h-[45rem] m_grid'>
      <header className='borad_header col-span-full m_border'>hello</header>
      <div className='col-span-9 row-span-2 m_border rounded-sm'></div>
      <div className='col-span-3 m_border row-span-9'></div>
      <div className='area_grid'>
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
