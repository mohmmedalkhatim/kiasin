import { useState } from 'react';
import Editor from '../../components/Editor';
import Cards from './Cards';
import Areas from './Area/Areas';

function Content ({ props, mode }: { props: any; mode: string }) {
  let [element, setElement] = useState(
    new Map([
      ['dialog_note', <Editor id={props.id} content={''} title={''} />],
      ['dialog_links', <Cards id={props.id} />],
      ['dialog_areas', <Areas id={props.id} />],
      ['default', <div>no Content</div>],
    ])
  );
  return <div>{element.get(mode) || element.get('default')}</div>;
}
export default Content;
