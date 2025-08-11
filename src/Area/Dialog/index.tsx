import { IconX } from '@tabler/icons-react';
import { useLayoutDialog } from '../../context/para/Dialog';
import Content from './content';
import './style.css';

function Dialog () {
  const props = useLayoutDialog(state => state.props);
  const state = useLayoutDialog(state => state.state);
  const mode = useLayoutDialog(state => state.mode);
  const close = useLayoutDialog(state => state.close);

  if (state) {
    return (
      <div className={mode + ' dialog m_border'}>
        <div className='absolute top-8 right-8 z-80 hover:bg-[#e2e2e220] p-2 rounded-full' onClick={close}>
          <IconX />
        </div>
        <Content mode={mode} props={props} />
      </div>
    );
  }
}
export default Dialog;
