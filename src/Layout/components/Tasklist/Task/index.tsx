import { useState } from 'react';
import Checkbox from '../../../../components/Checkbox';

function Task({ id, classn }: { id: number; classn: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className={`${classn} Task rounded-xs`}>
      <div>Task</div>
      <Checkbox state={checked} setState={setChecked} title={''} />
    </div>
  );
}
export default Task;
