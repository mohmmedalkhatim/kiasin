import { Dayjs } from "dayjs"
import { hours } from "../../Data/hours"
import { months } from "../../Data/Months"
import { Dispatch, SetStateAction } from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import useEventsCalender from "../../Hooks/useEventsCalender";






function EventsCalender({ current, active, setActive }: { current: Dayjs, active: Dayjs, setActive: Dispatch<SetStateAction<Dayjs>> }) {
    let { marker, selecting, ref, setSelecting, hourCheck, week, setSelected, selectingLogic, time_arr } = useEventsCalender(current, active);
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
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((item, index) => (<div key={index} className="day_marker w-full text-sm">{item} {active.startOf("week").add(index,"day").date()}</div>))}
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
                            {Array.from({ length: 7 }, (_, i) => {
                                let date = active.startOf("week").add(i, "day")
                                return date
                            }).map((_, week_index) => (
                                <div className="day_timeline w-full" key={week_index}>
                                    <div className="flex flex-col w-full">
                                        {time_arr(week_index).map((time, hour_index) => (
                                            <div id={String(time.date()) + String(hour_index)} onMouseOver={() => selectingLogic(selecting, setSelected, hour_index, time.date())} onMouseDown={(e) => {
                                                e.preventDefault()
                                                setSelecting(true)
                                                selectingLogic(selecting, setSelected, hour_index, time.date(), true)
                                            }} onMouseUp={(_e) => setSelecting(false)}
                                                className="border p-4 relative border-t-0 w-full dashed border-[#e3e3e320] h-10" ref={ref} key={hour_index}>
                                                {hourCheck(time.day(), hour_index) ? <>
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