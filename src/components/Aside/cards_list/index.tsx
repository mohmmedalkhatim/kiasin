import { useAreas } from "../../../context/para/areas";
import { Card } from "../../../types/area";

function Cards_List() {
  let list = useAreas(state => state.active);
  let update = useAreas(state => state.update);
  let update_active_area = useAreas(state => state.update_active_area);
  let active = list?.at(-1);
  if (active && list) {
    let on_card_created = (s: string, type: string, cols: string, rows: string, props: any | undefined) => {
      active.ui_schema.item.push({ id: list.length, } as Card)
      update_active_area(active)
      update(active);
    }
  }
  return (
    <div className="grid area_templates_grid ">
      <div className="m_border area_templates_element">

      </div>
    </div>
  );
}
export default Cards_List;
