
const Card = ({ image, id }: { image: String; id: String }) => {
  return (
    <div className='relative flex flex-col rounded-md m_border bg-clip-border text-gray-700 shadow-md'>
      <div
        style={{ backgroundImage: `url(${image})` }}
        className='relative  h-40 overflow-hidden bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r border-[#e2e2e220] border-b'
      ></div>
      <div className='px-4 py-3 flex items-center justify-between'>
        <h5 className='block text-md font-sans font-semibold leading-snug tracking-normal text-white antialiased'>
          {id}
        </h5>
      </div>
    </div>
  )
}
export default Card
