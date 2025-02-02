import { useEffect } from 'react'
import './style.css'
import Borad from '../../components/board'

function Dashborad () {
  useEffect(() => {}, [])

  return (
    <main className='content flex flex-col'>
      <Borad />
    </main>
  )
}
export default Dashborad
