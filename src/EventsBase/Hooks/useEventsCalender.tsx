import dayjs, { Dayjs } from "dayjs";
import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";
import { useInterval } from "react-use";

function useEventsCalender(current: Dayjs, active: Dayjs) {

    const ref = useRef<HTMLDivElement>(null);
    const week = current.date() == active.date() && current.month() == active.month() && active.year() == active.year()
    function hourCheck(week_index: number, day_index: number) {
        return current.startOf("week").add(week_index, 'day').date() === current.date() && current.get("hour") == ((day_index) / 2) && current.date() == active.date() && current.month() == active.month() && active.year() == active.year()
    }
    const [selected, setSelected] = useState<{ day: number, hour: number, self: HTMLElement }[]>([])
    const [marker, setMarker] = useState("0px");
    const [selecting, setSelecting] = useState(false)
    useInterval(() => {
        if (ref.current) {
            setMarker(`${Math.floor(((((ref.current?.clientHeight / 100)) * dayjs().get("minute")) * 2) * 2) * 2}%`)
        }
    }, 30000)
    useEffect(() => {
        if (ref.current) {
            setMarker(`${Math.floor(((((ref.current?.clientHeight / 100)) * dayjs().get("minute")) * 2) * 2) * 2}%`)
        }
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
    let selectingLogic = (selecting: boolean, setSelected: Dispatch<SetStateAction<{ day: number, hour: number, self: HTMLElement }[]>>, hour_index: number, week_index: number, clicked = false) => {
        if (selecting || clicked) {
            let self = document.getElementById(String(week_index) + String(hour_index));
            if (self) {
                self.style.transition = "none"
                self.style.background = "#323232"
                setSelected(prev => { prev.push({ day: week_index, hour: hour_index, self }); return prev })
            }
        }
    }
    let time_arr = (week_index: number) => {
        return Array.from({ length: 48 }, (_, i) => {
            let half_hour = i * 30;
            let date = active.startOf("week").add(week_index, "day").add(half_hour, "minute")
            return date
        })
    }


    return { ref, marker, selecting, selected, setSelecting, setMarker, hourCheck, week, setSelected, time_arr, selectingLogic }
}
export default useEventsCalender