import './index.css';
import { useEffect, useState } from 'react';
import { useAreas } from '../../../context/para/areas';
import { MultipleContainers } from '../../dnd/2.Presets/Sortable/MultipleContainers';
import { UniqueIdentifier } from '@dnd-kit/core';

function Kanban({ id, cols }: { id: number, cols: number | undefined }) {
  const get_Card = useAreas(state => state.get_Card)
  const update_card = useAreas(state => state.update_card)
  const [schema, setSchema] = useState<{items:{},containers:UniqueIdentifier[]}>();
  useEffect(() => {
    let card = get_Card(id);
    setSchema({items:card.props.columns,containers:card.props.containers as UniqueIdentifier[]})
    update_card(id, card)
  }, [])
  if (schema) {
    return (
      <div className='flex w-full h-full gap-2 p-2 '>
        <MultipleContainers card_id={id} containers_arr={schema.containers} columns={cols} items={schema.items} containerStyle={{ background: "#181818", color: "white", border: "1px solid #e2e2e220" }} />
      </div>
    );
  }
}

export default Kanban;
