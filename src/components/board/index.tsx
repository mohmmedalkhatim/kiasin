import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy
} from '@dnd-kit/sortable'
import { useState } from 'react'
import Grid from './main/Grid'
import Card from './main/Card'
import { Layout, useLayout } from '../../context/page_schema'

const Board: React.FC = () => {
  let {list, sort_list, updateSort } = useLayout()

  const [activeId, setActiveId] = useState<string | null>(null)

  // Configure sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    updateSort(sort_list,active,over,list)
    setActiveId(null)
  }
  if (sort_list) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sort_list} strategy={rectSortingStrategy}>
          <Grid columns={8}>
            {sort_list.map(id => (
              <Card key={id} id={id} />
            ))}
          </Grid>
        </SortableContext>
        <DragOverlay>{activeId ? <Card id={activeId} /> : null}</DragOverlay>
      </DndContext>
    )
  } else {
    return <div>there is an error</div>
  }
}

export default Board
