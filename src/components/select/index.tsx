
type SelectProps = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>
type OptionProps = React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;


function Select(props: SelectProps) {
  return (
    <div className="p-1 rounded w-full m_border pr-2">
      <select {...props} className="pl-0  focus:outline-none px-3 text-xs text-[#e2e2e2e2] w-full  bg-[#181818] rounded"></select>
    </div>
  )
}
Select.Option = (props: OptionProps) => {
  return (
    <option {...props}>

    </option>
  )
}

export default Select

