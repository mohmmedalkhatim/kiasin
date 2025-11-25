
type SelectProps = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>
type OptionProps  = React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;


function Select(props:SelectProps) {
  return (
    <select {...props}></select>
  )
}
Select.Option = (props:OptionProps)=>{
    return (
        <option {...props}>
            
        </option>
    )
}

export default Select

