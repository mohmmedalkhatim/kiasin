import { IconChevronDown } from "@tabler/icons-react"
import { Dispatch, SetStateAction, useRef, useState } from "react"

function Field({ name, DB_ID, list, setValue, value }: { name: string, DB_ID: number, list: string[], value: string, setValue: Dispatch<SetStateAction<string>> }) {
  let [opened, setOpened] = useState(false)
  let ref = useRef(name)
  return (
    <>
      <div className="relative">
        <div onClick={() => setOpened(state=>!state)} role="combobox" className="m_border z-20 relative flex items-center justify-between  rounded-none p-3 " defaultValue={name}>
          <div>{value}</div>
          <div><IconChevronDown /></div>
        </div>
        <div className="absolute w-full right-0 bg-[#181818] z-30">
          {opened && <div >
            {list.map((option) => (<div role="option" onClick={() => {
              setValue(option)
              setOpened(false)
            }} className="bg-[#181818] m_border p-3 z-60 hover:bg-[#323232]">{option}</div>))}
          </div>}
        </div>
      </div>
    </>
  )
}
export default Field