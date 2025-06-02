import './style.css';
import { IconCheck } from '@tabler/icons-react';

function Checkbox({
  state,
  setState,
}: {
  state: boolean;
  setState: any;
}) {
  return (
    <div
      className="m_border border rounded w-5 h-5 flex items-center justify-center cursor-pointer"
      onClick={() => setState(!state)}
    >
      <div
        className={`bg-blue-500 ${!state && 'opacity-0'}   rounded transition-all duration-100`}
      >
        <IconCheck size={'1rem'} color="white"></IconCheck>
      </div>
    </div>
  );
}
export default Checkbox;
