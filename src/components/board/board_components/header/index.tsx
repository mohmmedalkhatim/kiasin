const DashHeader = () => {
  return (
    <header className='dashboard_header text-sm m_border'>
        <ul className="flex gap-4">
            <li className="link rounded hover:font-normal">project</li>
            <li className="link rounded hover:font-normal">areas</li>
            <li className="link rounded hover:font-normal">resources</li>
            <li className="link rounded hover:font-normal">archive</li>
        </ul>
    </header>
  )
}
export default DashHeader