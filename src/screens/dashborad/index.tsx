import { useEffect, useState } from 'react'
import "./style.css";
function Dashborad () {
  let [media, setmedia] = useState();
  useEffect(() => {}, [])
  return (
    <main className='h-[45rem] m_grid'>
      <header className='board_header'>
        hello
      </header>
      <div>world</div>
    </main>
  )
}
export default Dashborad
