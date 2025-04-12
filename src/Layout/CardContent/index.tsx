import { useEffect, useState } from 'react';
import AreasList from '../components/List';
import Editor_card from '../components/Editor';
import TaskList from '../components/Tasklist';
import Image from '../components/Image';
import Calendar from '../components/Calender';

function CardContent({ T, props }: { T: string; props: any }) {
  const [map, setMap] = useState(
    new Map([
      ['editor', <Editor_card content={props} title={'untitled'} />],
      ['Areaslist', <AreasList list={props} />],
      ['tasks', <TaskList list={props} />],
      ['image', <Image url={props} />],
      ['calender', <Calendar />],
      ['default', <div>no content</div>],
    ])
  );
  useEffect(() => { }, []);
  const action = map.get(T) || map.get('default');
  return action;
}
export default CardContent;
