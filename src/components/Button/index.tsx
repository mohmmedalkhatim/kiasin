import './style.css'

function Button ({ content ,size }: { content: String,size:string }) {
  return (
    <button data-ripple-light='true' type='button' className={size}>
      {content}
    </button>
  )
}
export default Button
