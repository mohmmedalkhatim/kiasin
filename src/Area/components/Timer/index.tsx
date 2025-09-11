import {  useRef, useState } from "react"
import { IconPlayerPauseFilled,  IconPlayerPlayFilled,  IconPlayerSkipBackFilled } from "@tabler/icons-react";

class Timer {
    seconds = 0;
    hours = 0;
    mints = 0;
    constructor() {

    }
    add_seconds(seconds: number) {
        if (this.seconds >= 59) {
            this.mints = this.mints + 1
            this.seconds = 0
        } else if (seconds >= 60) {
            this.mints = this.mints + 1
        }
        else {
            this.seconds = this.seconds + seconds
        }
        return this
    }
    add_mints(mints: number) {
        if (mints + this.mints >= 60) {
            this.hours = this.hours + 1
            this.mints = 0
        } else if (this.mints >= 59) {
            this.hours = this.hours + 1
            this.mints = 0
        }
        else {
            this.mints = this.mints + mints
        }
        return this
    }
    add_hours(hours: number) {
        if (this.hours >= 24) {
            this.hours = 0
        }
        else {
            this.hours = this.hours + hours
        }
        return this
    }
    format(): string {
        let hours = this.hours < 10 ? `0${this.hours}` : `${this.hours}`
        let mints = this.mints < 10 ? `0${this.mints}` : `${this.mints}`
        let seconds = this.seconds < 10 ? `0${this.seconds}` : `${this.seconds}`
        return `${hours}:${mints}:${seconds}`
    }
}

function TimerCard() {
    let time_id = useRef(0)
    const [timer, setTimer] = useState(new Timer())
    const [fmt, setFmt] = useState(timer.format())
    const start_timer = () => {
        clearInterval(time_id.current)
        time_id.current = setInterval(() => {
            setTimer(prev => {
                let next = prev.add_seconds(1)
                setFmt(next.format())
                return next
            })
        }, 1000)
    }
    const count_down = () => {
        clearInterval(time_id.current)
        time_id.current = setInterval(() => {
            setTimer(prev => {
                let next = prev.add_seconds(-1)
                setFmt(next.format())
                return next
            })
        }, 1000)
    }
    return (
        <div className="flex items-center flex-col justify-center h-full gap-8">
            <div className="text-3xl pt-8 font-semibold">
                {timer.format()}
            </div>
            <div className="flex gap-4 absolute top-4 left-4">
                <div onClick={count_down} className="Timer_button"><IconPlayerSkipBackFilled size={"1rem"} /></div>
                <div onClick={start_timer} className="Timer_button"><IconPlayerPlayFilled size={"1rem"} /></div>
                <div onClick={() => clearInterval(time_id.current)} className="Timer_button"><IconPlayerPauseFilled size={"1rem"} /></div>
            </div>
            <div className="flex gap-4">
                <div className="Timer_button" onClick={() => {

                    setTimer(prev => {
                        setFmt(timer.format())
                        return prev.add_mints(30)
                    })
                }}>30m</div>
                <div className="Timer_button" onClick={() => {

                    setTimer(prev => {
                        setFmt(timer.format())
                        return timer.add_mints(60)
                    })
                }}>1h</div>
                <div className="Timer_button" onClick={() => {

                    setTimer(prev => {
                        setFmt(timer.format())
                        return timer.add_mints(120)
                    })
                }}>2h</div>
            </div>
        </div>
    )
}
export default TimerCard