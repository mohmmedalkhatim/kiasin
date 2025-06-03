import { useEffect, useState } from 'react';
import AreasList from '../components/List';
import Editor_card from '../components/Editor';
import TaskList from '../components/Tasklist';
import Image from '../components/Image';
import Calendar from '../components/Calender';

type Card_content = { id: number; T: string; props?: any };

function CardContent({ id, T, props }: Card_content) {
  const [map, setMap] = useState(
    new Map([
      ['editor', <Editor_card content={props} id={id} title={'untitled'} />],
      ['Areaslist', <AreasList id={id} />],
      ['tasks', <TaskList id={id} />],
      ['image', <Image id={id} />],
      ['calender', <Calendar />],
      ['default', <div>no content</div>],
    ])
  );
  useEffect(() => {}, []);
  const action = map.get(T) || map.get('default');
  return action;
}
export default CardContent;
