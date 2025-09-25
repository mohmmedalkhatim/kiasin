import { useCallback, useEffect, useRef, useState } from "react"
import { IconArrowLoopLeft, IconArrowLoopLeft2, IconChevronDown, IconChevronUp, IconDots, IconMenu, IconMenu2, IconMenu3, IconMenu4, IconPlayerPause, IconPlayerPlay, IconTriangleFilled } from "@tabler/icons-react";
import Button from "../../../components/Button";
import Checkbox from "../../../components/Checkbox";
import { CSSTransition } from "react-transition-group"


function TimerCard() {
    const time_set = useRef(null)
    const time_clock = useRef(null)
    const [time, setTime] = useState(15)
    const [skip, setSkip] = useState(false)
    const [mode, setMode] = useState("setting")

    return (
        <div className="flex items-center justify-center flex-col h-full gap-8">
            <CSSTransition
                nodeRef={time_set}
                in={mode == "setting"}
                timeout={600}
                classNames="fade"
                unmountOnExit
            >
                <div ref={time_set} className="flex items-center justify-center flex-col h-full gap-7">
                    <div className="text-3xl font-semibold flex items-center  bg-[#1f1f1f] rounded border-b border-[#e2e2e280] ">
                        <div>
                            <div className=" flex-3 letter  border-r-1 border-[#e2e2e220] px-6 py-4">
                                <div className="flex items-center flex-col justify-center">
                                    <div className="text-3xl font-semibold">
                                        {time >= 10 ? time : "0" + time}
                                    </div>
                                    <div className="text-xs font-medium text-[#e2e2e2]">mins</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col  flex-2 text-[#e2e2e2] items-center justify-center">
                            <div className="p-2 flex item-center justify-center border-b border-[#e2e2e220]" onClick={() => {
                                if (time > 0 && time < 60) {
                                    setTime(prv => prv + 5)
                                } else if (time > 60 && time < 120) {
                                    setTime(prv => prv + 15)
                                } else {
                                    setTime(prv => prv + 25)
                                }
                            }}><IconChevronUp /></div>
                            <div className="p-2 flex item-center justify-center border-t border-[#e2e2e220]" onClick={() => {
                                if (time > 0 && time < 60 && (time - 5) > 0) {
                                    setTime(prv => prv - 5)
                                } else if (time > 60 && time < 120 && (time - 5) > 0) {
                                    setTime(prv => prv - 15)
                                } else if ((time - 5) > 0) {
                                    setTime(prv => prv - 25)
                                }
                            }}><IconChevronDown /></div>
                        </div>
                    </div>
                    <div className="flex gap-2 text-[#e2e2e235] items-center text-sm">
                        <Checkbox setState={setSkip} state={skip} />
                        Skip breaks
                    </div>
                    <Button size="md" className="text-xs" onClick={() => setMode("timer")} >
                        <div className="rotate-90 text-[#181818]">
                            <IconTriangleFilled size={"0.7rem"} />
                        </div>
                        <div className="text-[#181818]">
                            start focus section
                        </div>
                    </Button>
                </div>
            </CSSTransition>
            <CSSTransition
                nodeRef={time_clock}
                in={mode == "timer"}
                timeout={600}
                classNames="fade"
                unmountOnExit
            >
                <div className="absolute" ref={time_clock} onClick={() => { }}>
                    <FocusSession sessionMinutes={45} size={224} />
                </div>

            </CSSTransition>
        </div >
    )
}
export default TimerCard




interface FocusSessionProps {
    size?: number; // diameter of the circle
    sessionMinutes: number; // session duration in minutes
}

const FocusSession: React.FC<FocusSessionProps> = ({
    size = 256, // default 256px (like screenshot)
    sessionMinutes,
}) => {
    const [timeLeft, setTimeLeft] = useState(sessionMinutes * 60);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Reset when sessionMinutes changes from outside
    useEffect(() => {
        setTimeLeft(sessionMinutes * 60);
        setIsRunning(false);
    }, [sessionMinutes]);

    // Timer logic
    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning]);

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(sessionMinutes * 60);
    };

    const minutes = Math.floor(timeLeft / 60);
    const progress = (timeLeft / (sessionMinutes * 60)) * 100;

    const radius = size / 2;
    const ticks = 20; // number of ticks around circle
    const tickLength = size * 0.07; // dynamic tick size

    return (
        <div
            className=" text-white rounded-xl  flex flex-col items-center"
            style={{ width: size + 64 }}
        >

            {/* Dial */}
            <div className="relative flex items-center justify-center m_border rounded-full" style={{ width: size , height: size}}>
                <svg className="absolute  -rotate-270" viewBox={`0 0 ${size} ${size}`}>
                    {/* ticks background */}
                    {[...Array(ticks)].map((_, i) => (
                        <line
                            key={i}
                            x1={radius}
                            y1={radius * 0.15}
                            x2={radius}
                            y2={radius * 0.15 + tickLength}
                            className="stroke-[#e2e2e220]"
                            strokeLinecap="round"
                            strokeWidth={size * 0.035}
                            transform={`rotate(${360 - (360 / ticks) * i} ${radius} ${radius})`}
                        />
                    ))}
                    {/* progress tick */}
                    <line
                        x1={radius}
                        y1={radius * 0.15}
                        x2={radius}
                        y2={radius * 0.15 + tickLength}
                        stroke="#3aa6ff"
                        strokeWidth={size * 0.035}
                        strokeLinecap="round"
                        transform={`rotate(${360 - (progress * 360) / 100} ${radius} ${radius})`}
                    />
                </svg>

                {/* Time in the middle */}
                <span className=" gap-1 flex items-center ">
                    <span className="text-3xl font-medium">
                        {minutes}
                    </span>
                    <span className="text-sm h-9 flex items-end">
                        min
                    </span>
                </span>
            </div>

            {/* Controls */}
            <div className="flex space-x-6 mt-6 items-center">
                <button
                    onClick={() => setIsRunning((p) => !p)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-500 hover:bg-sky-600 transition"
                >
                    {isRunning ? <IconPlayerPause size={"1.2rem"} /> : <IconPlayerPlay size={"1.2rem"} />}
                </button>
                <button
                    onClick={resetTimer}
                    className="timer_button"
                >
                    <IconArrowLoopLeft2 size={"1.2rem"} />
                </button>
                <button className="timer_button">
                    <IconDots size={"1.2rem"} />
                </button>
            </div>
        </div>
    );
};


