import { useAreas } from '../../../context/para/areas';

function Cards ({ id }: { id: number }) {
  let area = useAreas(state => state.active)?.at(-1)?.ui_schema;
  let update = useAreas(state => state.update_card);
  let get_card = useAreas(state => state.get_Card);
  return (
    <div>
      {area?.item.map(item => {
        if (item.type == 'tasks') {
          return (
            <div
              onClick={() => {
                let card = get_card(id).props.push(item.id)
                update(id, card);
              }}
            >
              {item.type}
            </div>
          );
        }
      })}
    </div>
  );
}
export default Cards;
