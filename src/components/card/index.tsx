



const Card = ({ image }: { image: String }) => {
  return (
    <div className='relative flex lg:w-[19rem] w-full flex-col rounded-md m_border bg-clip-border mx-[2px] my-[2px1] text-gray-700 shadow-md'>
      <div
        style={{ backgroundImage: `url(${image})` }}
        className='relative mx-2 my-2 h-36 overflow-hidden rounded-md bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r m_border'
      ></div>
      <div className='p-4 flex items-center justify-between'>
        <h5 className='mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-white antialiased'>
          Tailwind card
        </h5>
        <button
          data-ripple-light='true'
          type='button'
          className='select-none rounded-md bg-sky-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
        > Read More
        </button>
      </div>
    </div>
  )
}
export default Card
