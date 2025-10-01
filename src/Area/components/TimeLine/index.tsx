import dayjs, { Dayjs } from "dayjs";
import React from "react";

type Event = {
  id: number;
  title: string;
  start: Dayjs; // hour (0 - 23)
  end: Dayjs;   // hour (0 - 23)
};

interface TimelineProps {
  date: string;
  events: Event[];
  hours?: number; // default 24 hours
}

export default function Timeline({ date, events, hours = 24 }: TimelineProps) {
  const hourMarks = Array.from({ length: hours }, (_, i) => dayjs().add(i, 'hour'));

  return (
    <div className="bg-[#181818] text-gray-200 rounded-md  overflow-hidden h-full">
      <div className="flex items-center  justify-between border-b border-[#e2e2e220] px-4 py-2 text-sm">
        <div className="font-semibold">{date}</div>
        <div className="flex gap-2 text-xs text-gray-400">
          <button className="hover:text-white">Day ▼</button>
          <button className="hover:text-white">Today</button>
        </div>
      </div>

      <div className="flex w-full overflow-x-auto h-full">
        <div className="w-32  flex flex-col items-start p-2">
          <button className="flex items-center gap-1 text-xs  hover:text-white">
            + New
          </button>
        </div>

        <div className="relative">
          <div className="flex border-b border-[#e2e2e220]">
            {hourMarks.map((h) => (
              <div
                key={h.hour()}
                className="flex-1 min-w-[80px] text-[11px] text-center border-l border-[#e2e2e220] py-1"
              >
                {h.hour() === 0 ? "12 AM" : h.hour() < 12 ? `${h.hour()} AM` : h.hour() === 12 ? "12 PM" : `${h.hour() - 12} PM`}
              </div>
            ))}
          </div>

          <div className="relative h-[85%]">
            <div className="absolute inset-0 flex">
              {hourMarks.map((_, i) => {
                let time = dayjs().add(i, 'hour');
                return (
                  <div
                    key={i}
                    className="flex-1 min-w-[80px] border-l border-[#e2e2e220] "
                  />
                )
              })}
            </div>

            {events.map((event) => {
              const startPercent = (event.start.get("hour") / hours) * 100;
              const widthPercent = ((event.end.get("hour") - event.start.get("hour")) / hours) * 100;

              return (
                <div
                  key={event.id}
                  className="absolute top-4 h-10 bg-sky-500/80 text-white text-xs rounded px-2 flex items-center"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                >
                  {event.title}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
