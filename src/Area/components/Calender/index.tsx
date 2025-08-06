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

  const days = Array.from({ length: daysInMonth }, (_, i) =>
    startOfMonth.add(i, 'day')
  );

  return (
    <div className="p-4 max-w-xs font-light flex flex-col gap-y-2 ">
      <div className="flex justify-between items-center mb-1">
        <button
          onClick={prevMonth}
          className="p-1 rounded-none border-none hover:bg-gray-200 hover:opacity-5 "
        >
          <IconChevronLeft size={'1.2rem'} />
        </button>
        <h2 className="text-md">{currentDate.format('MMMM YYYY')}</h2>
        <button
          onClick={nextMonth}
          className="p-1 rounded-none border-none hover:bg-gray-200  hover:opacity-5 "
        >
          <IconChevronRight size={'1.2rem'} />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center gap-y-4 text-[#e2e2e298]">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-1 text-sm">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2 ">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={i}></div>
        ))}
        {days.map((day) => (
          <div
            key={day.toString()}
            className={`p-1 text-center hover:text-black transition cursor-pointer border border-transparent ${
              startDate && day.isSame(startDate, 'day')
                ? 'bg-sky-500 text-black border-sky-700'
                : endDate && day.isSame(endDate, 'day')
                  ? 'bg-sky-500  text-black border-sky-700'
                  : startDate &&
                      endDate &&
                      day.isAfter(startDate) &&
                      day.isBefore(endDate)
                    ? 'bg-sky-700'
                    : 'hover:bg-gray-200 text-[#e2e2e295]'
            } ${
              startDate && day.isSame(startDate, 'day')
                ? 'rounded-tl-md text-black'
                : startDate && endDate && day.isSame(endDate, 'day')
                  ? 'rounded-br-md text-black'
                  : ''
            }`}
            onClick={() => handleDateSelection(day)}
          >
            {day.date()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
