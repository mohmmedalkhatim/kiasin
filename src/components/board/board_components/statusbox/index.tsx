function Status({name,count}:{name:string,count:number}) {
  return (
    <div className="m_border bg-[#181818] flex-col w-full rounded-md lg:col-span-2 lg:row-span-2 flex items-center justify-center">
        <div className="lg:text-2xl text-gray-400">{count}</div>
        <div className="lg:text-sm text-xs w-full text-center text-gray-500">{name}</div>
    </div>
  )
}
export default Status