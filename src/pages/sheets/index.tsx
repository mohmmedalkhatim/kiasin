import SheetsList from "./sheets_list"
import SheetEditor from "./sheet_editor"
import { useState } from "react"
import "./style.css"
import Input from "../../components/input"
import { useAsync } from "react-use"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../contexts/store"
import { Dialog } from "../../components/Dialog"
import { retrieve_sheet } from "../../contexts/sheets/functions/retiveve"


function Sheets() {
  let [active, setActive] = useState<number | undefined>()
  let dispatch = useDispatch<AppDispatch>()
  let [open, setOpen] = useState(false)
  useAsync(async () => {
    if (active) {
      dispatch(retrieve_sheet(active))
    }
  }, [active])
  return (
    <>
      <main className=" mt-0 p-0  relative flex w-[calc(100vw-5rem)]">
        <header className="border-b border-primary" >header</header>
        <SheetsList setActive={setActive} activeId={active} />
        <div className="flex pt-12 w-full relative  pl-60">
          <SheetEditor />
        </div> 
      </main>
      <Dialog open={open} widthClass="w-[30rem]" bodyClassName="" onClose={function (): void {
        setOpen(false)
      }}>
        <div className="p-4">
          <div className="flex flex-col gap-4">
            <Input label="name" type="text" />
            <Input label="description" type="text" />
          </div>
        </div>
      </Dialog>
    </>
  )
}
export default Sheets
