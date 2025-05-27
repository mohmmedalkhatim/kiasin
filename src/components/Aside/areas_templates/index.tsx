import { useAreas } from '../../../context/para/areas';
import { useTemplates } from '../../../context/para/templates';
import Template_Card from './template_card';

function Areas_templates() {
  let list = useTemplates((state) => state.list);
  let create = useAreas((state) => state.create);

  return (
    <div>
      <div className="grid area_templates_grid ">
        {list.map((area) => (
          <Template_Card id={area.id} />
        ))}

        <div
          className="m_border area_templates_element"
          onClick={() => create(1)}
        >
          <div></div>
          <div className="text-center">create blank</div>
        </div>
      </div>
    </div>
  );
}
export default Areas_templates;
