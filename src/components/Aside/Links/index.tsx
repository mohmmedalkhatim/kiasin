import { Link } from 'react-router-dom'
import { IconDashboard, IconLayersIntersect } from '@tabler/icons-react'


function Links() {
  let arr = [
    { name: 'Dashboard', link: '/', Icon: <IconDashboard /> },
    { name: 'areas & recourses', link: '/areas',Icon: <IconLayersIntersect /> },
    { name: 'Projects_hub', link: '/' },
    { name: 'DataTree', link: '/' }
  ]
  return (
    <div className='links'>
      {arr.map((item, i) => (
        <Link key={i} className='link' to={item.link}>
          <div>{item.Icon}</div><div className='hidden md:block'>{item.name}</div>
        </Link>
      ))}
    </div>
  )
}
export default Links
