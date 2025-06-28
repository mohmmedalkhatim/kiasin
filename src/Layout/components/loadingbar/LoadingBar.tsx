import { useEffect, useRef, useState } from 'react';
import { useAreas } from '../../../context/para/areas';
import { IconLink } from '@tabler/icons-react';
import { useTasks } from '../../../context/para/tasks';
import { useLayoutDialog } from '../../../context/para/Dialog';
import { Todo } from '../../../types/todos';

export function LoadingBar ({ id }: { id: number }) {
  const active = useAreas(state => state.active)?.at(-1);
  const change_mode = useLayoutDialog(state => state.changeMode);
  const [list, setList] = useState<Todo[]>();
  const [link, setLink] = useState();
  const get_list = useTasks(state => state.get_list);
  const [counter, setCounter] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const ids:number[] = [];
  const width = 100 / ids.length;
  useEffect(() => {
    if (!list) {
      get_list(ids, setList);
    }
    const schema = active?.ui_schema.item;
    if (schema && ref.current) {
      let counter = 0;
      list?.map(item => {
        if (item.checked) {
          counter++;
          setCounter(counter);
        }
      });
    }
  }, [list, active]);
  if (ref.current) {
    ref.current.style.width = `${counter * width}%`;
  }
  return (
    <div className='h-full'>
      <div className='bg-white h-full rounded-r-lg' ref={ref}></div>
      <div className='absolute right-5 bottom-5'>
        <IconLink size={'1.3rem'} color='#e2e2e240' />
      </div>
    </div>
  );
}
