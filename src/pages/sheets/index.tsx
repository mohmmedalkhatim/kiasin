import SheetsList from "./sheets_list"
import SheetEditor from "./sheet_editor"
import { useState } from "react"
import "./style.css"
import Input from "../../components/input"
import { useAsync } from "react-use"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../contexts/store"
import { Dialog } from "../../components/Dialog"
import { sheet_data } from "../../contexts/sheets/functions/retiveve"


function Sheets() {
    let [active, setActive] = useState<number>(0)
    let dispatch = useDispatch<AppDispatch>()
    let [open, setOpen] = useState(false)
    useAsync(async () => {
        dispatch(sheet_data(active))
    }, [active])
    return (
        <>
            <main className=" mt-0 p-0  relative flex w-screen">
                <header className="border-b border-primary" >header</header>
                <SheetsList setActive={setActive} />
                <div className="flex pt-18 w-full relative  pl-72">
                    <SheetEditor/>
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
