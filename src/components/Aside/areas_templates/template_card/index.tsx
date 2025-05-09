import { useTemplates } from '../../../../context/para/templates';
import { Link } from 'react-router-dom';

const Template_Card = ({ id }: { id: number }) => {
  const get_list_item = useTemplates((state) => state.get_list_item);
  const area = get_list_item(id);
  if (area) {
    return (
      <div onClick={() => {}}>
        <div className="relative flex flex-col rounded-md m_border bg-clip-border text-gray-700 shadow-md">
          <div
            style={{ backgroundImage: `url()` }}
            className="relative  h-28 overflow-hidden bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r border-[#e2e2e220] border-b"
          ></div>
          <div className="px-4 py-3 flex items-center justify-between">
            <h5 className="block text-md font-sans font-semibold leading-snug tracking-normal text-white antialiased">
              {area.title}
            </h5>
          </div>
        </div>
      </div>
    );
  }
};
export default Template_Card;
