import Button from '../Button'

const Card = ({ image, name }: { image: String; name: String }) => {
  return (
    <div className='relative flex w-[32%] flex-col rounded-md m_border bg-clip-border text-gray-700 shadow-md'>
      <div
        style={{ backgroundImage: `url(${image})` }}
        className='relative  h-36 overflow-hidden bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r border-[#e2e2e220] border-b'
      ></div>
      <div className='px-4 py-4 mt-2 flex items-center justify-between'>
        <Button content={'open'} />
        <h5 className='block font-sans text-xl font-semibold leading-snug tracking-normal text-white antialiased'>
          {name}
        </h5>
      </div>
    </div>
  )
}
export default Card
