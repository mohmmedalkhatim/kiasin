import { forwardRef } from 'react'
import './style.css'

type Inputprops<V, P> = {
  action?: () => void
  value?: V
  props?: P
  type?: string
  pleaceholder?: string
}

function Input<V extends string | number | readonly string[] | undefined, P> ({
  action,
  value,
  props,
  type,
  pleaceholder
}: Inputprops<V, P>) {
  return (
    <input
      onChange={action}
      placeholder={pleaceholder}
      className='input m_border'
      type={type}
      value={value}
      {...props}
    />
  )
}
export default forwardRef(Input)
