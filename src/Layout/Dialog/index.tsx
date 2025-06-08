import { useLayoutDialog } from '../../context/para/Dialog';
import Content from './content';
import DialogHeader from './Header';
import './style.css';

function Dialog () {
  let state = useLayoutDialog(state => state.state);
  let mode = useLayoutDialog(state => state.mode);
  if (state) {
    return (
      <div className={mode + ' dialog m_border'}>
        <DialogHeader />
        <Content mode={mode} props={state}/>
      </div>
    );
  }
}
export default Dialog;
