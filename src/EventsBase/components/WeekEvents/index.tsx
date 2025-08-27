import { hours } from "../../Data/hours"


function WeekEvents() {
    return (
        <div className="week_events flex-col border border-[#e3e3e320]">
            <div className="flex flex-col">
                <div className="p-4 border-b border-[#e2e2e220] rounded-t">
                    hello world
                </div>
                <div className="flex">
                    <div className="flex overflow-auto flex-col">
                        <div className="flex scroller">
                            <div className="min-w-20 border border-[#e2e2e220]"></div>
                            <div className="flex w-full">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((item) => (<div className="day_marker w-full">{item}</div>))}</div>
                            <div className="w-[13px] border-y border-[#e2e2e220]"></div>
                        </div>
                        <div className="flex  max-h-[35rem] overflow-auto">
                            <div>
                                {hours.map(item => (<>
                                    <div className="border-y-none px-4 pt-4 border-[#e3e3e320] h-14 w-20">{item}</div>
                                    <div className="border-b px-4 border-[#e3e3e320] h-14 w-20"></div>
                                </>
                                ))}
                            </div>
                            {Array.from({ length: 7 }).map((item) => (
                                <div className="day_timeline">
                                    <div className=" flex flex-col">
                                        {Array.from({ length: 48 }).map((item, index) => (
                                            <div className="border p-4 relative  border-t-0 dashed border-[#e3e3e320] h-14"></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default WeekEvents