import { IconX } from '@tabler/icons-react';
import { useLayoutDialog } from '../../context/para/Dialog';
import Content from './content';
import './style.css';

function Dialog () {
  const props = useLayoutDialog(state => state.props);
  const state = useLayoutDialog(state => state.state);
  const mode = useLayoutDialog(state => state.mode);
  const toggle = useLayoutDialog(state => state.toggle);
  if (state) {
    return (
      <div className={mode + ' dialog m_border'}>
        <div className='absolute top-5 right-5' onClick={toggle}>
          <IconX />
        </div>
        <Content mode={mode} props={props} />
      </div>
    );
  }
}
export default Dialog;
