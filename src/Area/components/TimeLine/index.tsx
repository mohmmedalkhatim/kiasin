import { IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronsRight, IconTimelineEvent } from "@tabler/icons-react";
import dayjs, { Dayjs } from "dayjs";
import Button from "../../../components/Button";
import { months } from "../../../EventsBase/Data/Months";

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
      <div className="flex items-center  justify-between px-4 py-3 text-sm">
        <div className="flex items-center  gap-2 bg-[#e2e2e240] px-3  text-xs py-1 rounded-full">
          <IconTimelineEvent size={"0.8rem"} className="pt-[1px]" />
          <div>
            events
          </div>
        </div>
        <div>
          <div></div>
          <Button size="sm" className="font-bold">
            <div className=""> New</div>
            <div>
              <IconChevronDown size={"0.9rem"} />
            </div>
          </Button>
        </div>
      </div>
      <div className="flex items-center px-6 py-3 text-xs border-b border-[#e2e2e220] justify-between">
        <div className="flex items-center gap-2">
          <IconChevronsRight size={"1rem"} color="#e2e2e280"/>
          <div>{months[dayjs().get("month")]}</div>
        </div>
        <div className="flex ">
          {months[dayjs().month()]+"  "+dayjs().date()}
        </div>
        <div className="flex items-center gap-3">
          <div><IconChevronLeft size={"1rem"} /></div>
          <div>today</div>
          <div><IconChevronRight size={"1rem"} /></div>
        </div>
      </div>

      <div className="flex w-full overflow-y-hidden  h-[70%] pb-0">

        <div className="relative">
          <div className="flex">
            {hourMarks.map((h) => (
              <div
                key={h.hour()}
                className="flex-1 min-w-[80px] text-[11px] text-center border-l border-[#e2e2e220] py-1"
              >
                {h.hour() === 0 ? "12 AM" : h.hour() < 12 ? `${h.hour()} AM` : h.hour() === 12 ? "12 PM" : `${h.hour() - 12} PM`}
              </div>
            ))}
          </div>

          <div className="relative h-[84%] overflow-x-auto border-b border-[#e2e2e220]">
            <div className="absolute inset-0 flex h-full">
              {hourMarks.map((_, i) => {
                let time = dayjs().add(i, 'hour');
                return (
                  <div
                    key={i}
                    className="flex-1 min-w-[80px] border-l h-full border-[#e2e2e220] "
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
                  className="absolute top-4 h-[86%] border-l-8 bg-sky-500/80 text-white text-xs rounded px-2 flex items-center"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                >
                  <div className="h-4/5">{event.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div >
  );
}
