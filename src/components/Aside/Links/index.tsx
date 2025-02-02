import { Link } from 'react-router-dom'

function Links () {
  let arr = [
    { name: 'Dashboard', link: '/' },
    { name: 'areas & recourses', link: '/areas' },
    { name: 'Projects_hub', link: '/' },
    { name: 'DataTree', link: '/' }
  ]
  return (
    <div className='links'>
      {arr.map((item,i) => (
        <Link key={i} className='link' to={item.link}>
          <div className='hidden md:block'>{item.name}</div>
        </Link>
      ))}
    </div>
  )
}
export default Links
