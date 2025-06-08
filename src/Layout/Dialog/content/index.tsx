import { useState } from 'react';
import Editor from '../../components/Editor';
import Cards from './Cards';

function Content ({ props, mode }: { props: any; mode: string }) {
  let [element, setElement] = useState(
    new Map([
      ['dialog_note', <Editor id={props.id} content={''} title={''} />],
      ['dialog_links', <Cards />],
      ['default', <div>no Content</div>],
    ])
  );
  return <div>{element.get(mode) || element.get('default')}</div>;
}
export default Content;
