import React, { useState } from 'react';
import dayjs from 'dayjs';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);

  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const startDay = startOfMonth.day();
  const daysInMonth = endOfMonth.date();
  const lastMonth = currentDate.subtract(1, 'month')
  const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));

  const handleDateSelection = (day: dayjs.Dayjs) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (day.isAfter(startDate)) {
      setEndDate(day);
    } else {
      setStartDate(day);
      setEndDate(null);
    }
  };

  const saveSelection = () => {
    console.log('Selected Range:', {
      startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
    });
  };
  let count = 0;
  let daysCount = 1;
  const days = Array.from({ length: daysInMonth }, (_, i) =>
    startOfMonth.add(i, 'day')
  );

  return (
    <div className="p-4 max-w-xs font-light flex flex-col gap-y-2 ">
      <div className="flex justify-between items-center mb-1">
        <button
          onClick={prevMonth}
          className="p-1 border-none hover:bg-white hover:text-black transition-colors duration-200 rounded-sm"
        >
          <IconChevronLeft size={'1.2rem'} />
        </button>
        <h2 className="text-md">{currentDate.format('MMMM YYYY')}</h2>
        <button
          onClick={nextMonth}
          className="p-1 border-none hover:bg-white hover:text-black transition-colors duration-200 rounded-sm"
        >
          <IconChevronRight size={'1.2rem'} />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center gap-4 mx-1 text-[#e2e2e298]">
        {['S', 'M', 'T', 'W', 'Th', 'F', 'S'].map((day) => (
          <div key={day} className="py-1 text-sm">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 ">
        {Array.from({ length: startDay }).map((_, i) => {
          count++
          daysCount++
          return (
            <div key={i} className='p-1 text-center text-xs rounded-full hover:text-black transition cursor-pointer border border-transparent '>{(lastMonth.daysInMonth() - startDay) + count}</div>
          )
        })}
        {days.map((day) => {
          daysCount++
          return (
            <div
              key={day.toString()}
              className={`p-1 text-center text-xs rounded-full hover:text-black transition cursor-pointer border border-transparent ${startDate && day.isSame(startDate, 'day')
                ? 'bg-[#4291c5] text-black border-sky-700'
                : endDate && day.isSame(endDate, 'day')
                  ? 'bg-[#4291c5]  text-black border-sky-700'
                  : startDate &&
                    endDate &&
                    day.isAfter(startDate) &&
                    day.isBefore(endDate)
                    ? 'bg-sky-500'
                    : 'hover:bg-gray-200 text-[#e2e2e295]'
                } ${startDate && day.isSame(startDate, 'day')
                  ? 'rounded-br-md text-black'
                  : startDate && endDate && day.isSame(endDate, 'day')
                    ? 'rounded-tl-md text-black'
                    : ''
                }`}
              onClick={() => handleDateSelection(day)}
            >
              {day.date()}
            </div>
          )
        })}
        {Array.from({ length: 42 - (startDay + 1) - daysInMonth + 1 }).map((_, i) => {
          count++
          return (
            <div key={i} className='p-1 text-center text-xs rounded-full hover:text-black transition cursor-pointer border border-transparent '>{i + 1}</div>
          )
        })}
      </div>
    </div>
  );
};

export default Calendar;
