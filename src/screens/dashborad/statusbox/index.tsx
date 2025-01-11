function Status({name,count}:{name:string,count:number}) {
  return (
    <div className="m_border flex-col w-full rounded-md p-6 flex items-center justify-center">
        <div className="text-2xl text-gray-400">{count}</div>
        <div className="text-gray-500">{name}</div>
    </div>
  )
}
export default Status