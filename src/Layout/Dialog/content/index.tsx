import { useState } from 'react';
import Cards from './Cards';
import Areas from './Area/Areas';
import NoteViewer from '../../components/NoteViewer';

function Content ({ props, mode }: { props: any; mode: string }) {
  let [element] = useState(
    new Map([
      ['dialog_note', <NoteViewer id={props.note_id} />],
      ['dialog_links', <Cards id={props.id} />],
      ['dialog_areas', <Areas id={props.id} />],
      ['dialog_tasks', <Cards id={props.id} />],
      ['default', <div>no Content</div>],
    ])
  );
  return <div>{element.get(mode) || element.get('default')}</div>;
}
export default Content;
