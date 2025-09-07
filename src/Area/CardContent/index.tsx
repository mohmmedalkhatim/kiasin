import { useEffect, useState } from 'react';
import AreasList from '../components/List';
import TaskList from '../components/Tasklist';
import Image from '../components/Image';
import { LoadingBar } from '../components/loadingbar/LoadingBar';
import TextInputArea from '../components/inputArea';
import EventCreate from '../components/EventCreater';
import Timer from '../components/Timer';

type Card_content = { id: number; T: string; props?: any };

function CardContent({ id, T, props }: Card_content) {
  const [map, setMap] = useState(
    new Map([
      ['editor', <TextInputArea id={id} />],
      ['Areaslist', <AreasList id={id} />],
      ['Timer', <Timer />],
      ['tasks', <TaskList id={id} />],
      ['image', <Image id={id} />],
      ['calender', <EventCreate />],
      ['LoadingBar', <LoadingBar id={id} />],
      ['default', <div>no content</div>],
    ])
  );
  useEffect(() => { }, []);
  const action = map.get(T) || map.get('default');
  return action;
}
export default CardContent;
