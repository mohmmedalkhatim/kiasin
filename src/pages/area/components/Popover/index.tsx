import { Popover, PopoverPanel, PopoverButton } from "@headlessui/react"
import { IconX, IconGrid3x3, IconForms } from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import Button from "../../../../components/Button"
import { create_card } from "../../../../contexts/area/functions/card/create"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../../contexts/store"



function popover() {
    const dispatch = useDispatch<AppDispatch>()
    let create_card_action = (type: string) => dispatch(create_card({ type }))
    let [popOverStatus, setPopOverStatus] = useState(false)
    let ref = useRef<HTMLDivElement>(null)
    let area = useSelector((state: RootState) => state.area.active.area)
    useEffect(() => {
    }, [area])
    return (
        <div className="flex justify-center  w-full" ref={ref}>
            {ref.current && <Popover className={"w-full"}>
                <PopoverPanel className="mb-2 border-border-main border gap-4 bg " style={{ zIndex: 20000 }}>
                    <div className="w-full justify-between p-5 flex "><div>cards</div> <IconX /></div>
                    <div className="flex flex-col gap-2">
                        <div className=" p-4">
                            <div className="w-full  flex items-center justify-between">
                                <div className="transition-colors z-100000 duration-200 hover:bg-support-400/50 rounded-sm p-2 flex items-center justify-center" onClick={() => create_card_action("areas_links")}>
                                    <IconGrid3x3 size={"1.8rem"} />
                                </div>
                                <div className="transition-colors z-100000 duration-200 hover:bg-support-400/50 rounded-sm p-2 flex items-center justify-center" onClick={() => create_card_action("form")}>
                                    <IconForms size={"1.8rem"} />
                                </div>
                                <div className="transition-colors z-100000 duration-200 hover:bg-support-400/50 rounded-sm p-2 flex items-center justify-center" onClick={() => create_card_action("value")}>
                                    <IconGrid3x3 size={"1.8rem"} />
                                </div>
                                <div className="transition-colors z-100000 duration-200 hover:bg-support-400/50 rounded-sm p-2 flex items-center justify-center" onClick={() => create_card_action("value")}>
                                    <IconGrid3x3 size={"1.8rem"} />
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="w-full  flex items-center justify-between">
                                <div className="transition-colors duration-200 hover:bg-support-400/50 rounded-sm p-2 flex items-center justify-center" onClick={() => create_card_action("areas_links")}>
                                    <IconGrid3x3 size={"1.8rem"} />
                                </div>
                                <div className="transition-colors duration-200 hover:bg-support-400/50 rounded-sm p-2 flex items-center justify-center" onClick={() => create_card_action("value")}>
                                    <IconGrid3x3 size={"1.8rem"} />
                                </div>
                                <div className="transition-colors duration-200 hover:bg-support-400/50 rounded-sm p-2 flex items-center justify-center" onClick={() => create_card_action("form")}>
                                    <IconForms size={"1.8rem"} />
                                </div>
                                <div className="transition-colors duration-200 hover:bg-support-400/50 rounded-sm p-2 flex items-center justify-center" onClick={() => create_card_action("value")}>
                                    <IconGrid3x3 size={"1.8rem"} />
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => setPopOverStatus(!popOverStatus)} className="w-full rounded-none">
                            show all
                        </Button>
                    </div>
                </PopoverPanel>
                <PopoverButton className={"w-full"}>
                    <Button className="w-full">
                        create
                    </Button>
                </PopoverButton>
            </Popover>}
        </div >
    )
}
export default popover
