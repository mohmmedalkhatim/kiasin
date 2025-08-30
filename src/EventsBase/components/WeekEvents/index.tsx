import dayjs, { Dayjs } from "dayjs"
import { hours } from "../../Data/hours"
import { months } from "../../Data/Months"
import { Dispatch, SetStateAction, use, useEffect, useRef, useState } from "react"
import { useInterval } from "react-use";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";




function EventsCalender({ current, active, setActive }: { current: Dayjs, active: Dayjs, setActive: Dispatch<SetStateAction<Dayjs>> }) {
    const ref = useRef<HTMLDivElement>(null);
    const week = current.date() == active.date() && current.month() == active.month() && active.year() == active.year()
    function hourCheck(week_index: number, day_index: number) {
        return current.startOf("week").date() + week_index === current.date() && current.get("hour") == ((day_index) / 2) && current.date() == active.date() && current.month() == active.month() && active.year() == active.year()
    }
    const [selected, useSelected] = useState<{ day: number, hour: number }[]>([])
    const [render, setRender] = useState(0)
    const [marker, setMarker] = useState("0px");
    const [selecting, setSelecting] = useState(false)
    useInterval(() => {
        setRender(prev => prev + 1)
    }, 1000)
    useEffect(() => {
        if (ref.current) {
            setMarker(`${Math.floor(((((ref.current?.clientHeight / 100)) * dayjs().get("minute")) * 2) * 2) * 2}%`)
        }
    }, [render])
    useEffect(() => {
        let element = document.getElementById("active");
        if (element && ref.current) {
            element?.scrollIntoView()
            ref.current.addEventListener("click", (_e) => {
                if (ref.current) {
                    ref.current.style.background = "#006dc1"
                }
            })
        }
    }, [active])
    return (
        <div className="week_events flex-col border border-[#e3e3e320]">
            <div className="flex flex-col w-full">
                <div className="px-8 py-4 border-b flex border-[#e2e2e220] gap-4 items-center rounded-t">
                    <div>{months[active.get("month")]} {active.get("D")}</div>
                    <button className="hover:bg-[#e2e2e210] rounded" onClick={() => setActive((prev: Dayjs) => prev.subtract(1, "week"))}><IconChevronLeft size={"1.0rem"} /></button>
                    <button className="hover:bg-[#e2e2e210] rounded" onClick={() => setActive((prev: Dayjs) => prev.add(1, "week"))}><IconChevronRight size={"1.0rem"} /></button>
                </div>
                <div className="flex w-full">
                    <div className="flex overflow-auto w-full flex-col">
                        <div className="flex scroller">
                            <div className="min-w-20 border border-[#e2e2e220]"></div>
                            <div className="flex w-full">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((item, index) => (<div key={index} className="day_marker w-full text-sm">{item} {active.startOf("week").date() + index}</div>))}
                            </div>
                            <div className="w-[13px] border-y border-[#e2e2e220]"></div>
                        </div>
                        <div className="flex  max-h-[35rem] w-full overflow-auto scroller">
                            <div>
                                {hours.map((item, index) => (<div key={index}>
                                    <div className={`border-y-none px-4 pt-4 border-[#e3e3e320] h-10 w-20 text-xs ${active.hour() === index ? "font-bold" : ""}`} id={index == active.hour() && week ? "active" : ""}>{item}</div>
                                    <div className="border-b px-4 border-[#e3e3e320] h-10 w-20"></div>
                                </div>
                                ))}
                            </div>
                            {Array.from({ length: 7 }).map((_, week_index) => (
                                <div className="day_timeline w-full" key={week_index}>
                                    <div className="flex flex-col w-full">
                                        {Array.from({ length: 48 }).map((_, hour_index) => (
                                            <div id={String(week_index) + String(hour_index)} onMouseOver={() => {
                                                if (selecting) {
                                                    let self = document.getElementById(String(week_index) + String(hour_index));
                                                    if (self) {
                                                        self.style.transition = "none"
                                                        self.style.background = "#323232"
                                                    }
                                                    useSelected(prev => { prev.push({ day: week_index, hour: hour_index }); return prev })
                                                }
                                            }} onMouseDown={(e) => {
                                                e.preventDefault()
                                                setSelecting(true)
                                                let self = document.getElementById(String(week_index) + String(hour_index));
                                                if (self) {
                                                    self.style.transition = "none"
                                                    self.style.background = "#323232"
                                                }
                                                useSelected(prev => { prev.push({ day: week_index, hour: hour_index }); return prev })
                                            }} onMouseUp={(e) => setSelecting(false)}
                                                className="border p-4 relative border-t-0 w-full dashed border-[#e3e3e320] h-10" ref={ref} key={hour_index}>
                                                {hourCheck(week_index, hour_index) ? <>
                                                    <div className="absolute border-y-1 right-0 w-full" style={{ top: ref.current ? marker : "" }}>
                                                        <div className="absolute bg-sky-400 rounded-full -left-2 w-3 h-3 z-40" style={{ top: "-0.375rem" }} > </div>
                                                    </div>
                                                    <div className="absolute border-t-1 right-0 z-20 border-dashed" style={{ top: ref.current ? marker : "", width: `${ref.current ? (ref.current?.clientWidth) * (week_index + 1) + (week_index) : 0}px` }} >
                                                    </div>
                                                </> : ""}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default EventsCalender