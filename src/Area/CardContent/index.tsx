import { useEffect, useState } from 'react';
import AreasList from '../components/List';
import TaskList from '../components/Tasklist';
import Image from '../components/Image';
import { LoadingBar } from '../components/loadingbar/LoadingBar';
import TextInputArea from '../components/inputArea';
import EventCreate from '../components/EventCreater';
import Timer from '../components/Timer';
import Status from '../components/Status';
import Timeline from '../components/TimeLine';
import dayjs from 'dayjs';

type Card_content = { id: number; T: string; props?: any };

function CardContent({ id, T, props }: Card_content) {
  const [events,_setEvents]  = useState([
    { id: 1, title: "Work Session", start: dayjs().startOf("D").add(9,"hours"), end: dayjs().startOf("D").add(12,"hours") },
    { id: 2, title: "Meeting", start: dayjs().startOf("D").add(13,"hours"), end: dayjs().startOf("D").add(15,"hours") },
    { id: 3, title: "Coding", start: dayjs().startOf("D").add(16,"hours"), end: dayjs().startOf("D").add(20,"hours") },
  ]);
  const [map, setMap] = useState(
    new Map([
      ['editor', <TextInputArea id={id} />],
      ['Areaslist', <AreasList id={id} />],
      ['Timer', <Timer />],
      ['Status', <Status />],
      ['tasks', <TaskList id={id} />],
      ['image', <Image id={id} />],
      ['calender', <EventCreate />],
      ['LoadingBar', <LoadingBar id={id} />],
      ['Timeline', <Timeline events={events} date='September 15, 2025' />],
      ['default', <div>no content</div>],
    ])
  );
  useEffect(() => { }, []);
  const action = map.get(T) || map.get('default');
  return action;
}
export default CardContent;
