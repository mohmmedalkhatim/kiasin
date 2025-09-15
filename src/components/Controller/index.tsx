import {  IconX } from "@tabler/icons-react"
import { invoke } from "@tauri-apps/api/core"

function WindowsControl() {

    return (
        <>
            <div className="fixed z-80 flex gap-2 top-5 left-6">
                <img src="/kiasin_logo.svg" height={22} width={22} />
            </div>
            <div className="fixed z-80 top-3 right-5 cursor-pointer items-center gap-3 flex" >
                <div className="flex p-3 rounded-sm items-center justify-center hover:bg-[#e2e2e220]"
                    onClick={() => {
                        invoke("window_control", { command: "min" })
                    }}>
                    <img src="/min.svg" alt="" width={16} height={16} />
                </div>

                <div className="flex p-3 rounded-sm items-center justify-center hover:bg-[#e2e2e220]"
                    onClick={() => {
                        invoke("window_control", { command: "max" })
                    }}>
                    <img src="/max.svg" alt="" width={16} height={16} />
                </div>

                <div className="hover:bg-red-500 rounded" onClick={() => {
                    invoke("window_control", { command: "close" })
                }}>
                    <IconX />
                </div>

            </div>
        </>
    )
}
export default WindowsControl