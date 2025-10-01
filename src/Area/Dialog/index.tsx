import { IconX } from '@tabler/icons-react';
import { useLayoutDialog } from '../../context/para/Dialog';
import Content from './content';
import './style.css';
import { CSSTransition } from 'react-transition-group';
import { useRef } from 'react';

function Dialog() {
  const props = useLayoutDialog(state => state.props);
  const state = useLayoutDialog(state => state.state);
  const mode = useLayoutDialog(state => state.mode);
  const close = useLayoutDialog(state => state.close);
  const ref = useRef(null)
  if(state)
    return (
      <CSSTransition in={state} classNames={"fade"}  timeout={300} unmountOnExit ref={ref}>
        <div className={mode + ' dialog m_border'} ref={ref}>
          <div className='absolute right-4 top-4 z-80 hover:bg-[#e2e2e220] p-2 rounded' onClick={close}>
            <IconX />
          </div>
          <Content mode={mode} props={props} />
        </div>
      </CSSTransition>
    );
}
export default Dialog;
