import { useEffect, useState } from 'react';
import AreasList from '../components/List';
import TaskList from '../components/Tasklist';
import Image from '../components/Image';
import Calendar from '../components/Calender';
import { LoadingBar } from '../components/loadingbar/LoadingBar';
import NoteViewer from '../components/NoteViewer';

type Card_content = { id: number; T: string; props?: any };

function CardContent({ id, T, props }: Card_content) {
  const [map, setMap] = useState(
    new Map([
      ['editor', <NoteViewer id={id} />],
      ['Areaslist', <AreasList id={id} />],
      ['tasks', <TaskList id={id} />],
      ['image', <Image id={id} />],
      ['calender', <Calendar />],
      ['LoadingBar', <LoadingBar id={id} />],
      ['default', <div>no content</div>],
    ])
  );
  useEffect(() => {}, []);
  const action = map.get(T) || map.get('default');
  return action;
}
export default CardContent;
