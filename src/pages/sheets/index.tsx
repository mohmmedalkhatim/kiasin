import SheetsList from "./sheets_list"
import SheetEditor from "./sheet_editor"
import { useState } from "react"
import "./style.css"
import { useAsync } from "react-use"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../contexts/store"
import { retrieve_sheet } from "../../contexts/sheets/functions/retiveve"


function Sheets() {
  let [active, setActive] = useState<number | undefined>()
  let dispatch = useDispatch<AppDispatch>()
  useAsync(async () => {
    if (active) {
      dispatch(retrieve_sheet(active))
    }
  }, [active])
  return (
    <>
      <main className="mt-0 p-0 relative flex">
        <SheetsList setActive={setActive} activeId={active} />
        <div className="flex w-full relative pl-[18rem]">
          <SheetEditor />
        </div>
      </main>
    </>
  )
}
export default Sheets
