import './style.css'
import Links from './Links'
import Profile_link from './profile'


function Aside () {
  return <aside className='aside'>
    <Profile_link/>
    <Links/>
  </aside>
}
export default Aside
