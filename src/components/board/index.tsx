import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useMemo, useState } from 'react'
import Grid from './main/Grid'
import Card from './main/Card'
import { useLayout } from '../../context/page_schema'


const Board: React.FC = () => {
  let { list, sort_list, updateSort } = useLayout()

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
    updateSort(sort_list, active, over, list)
    setActiveId(null)
  }
  let elements = useMemo(() => {
    if (sort_list) {
      return sort_list.map(id => (
        <Card cla={activeId === id ? 'dragging' : ''} key={id} id={id} />
      ))

    }
  }, [sort_list])

  if (sort_list) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sort_list} strategy={horizontalListSortingStrategy}>
          <Grid columns={8}>
            {elements}
          </Grid>
        </SortableContext>
        <DragOverlay>{activeId ? <Card cla='' id={activeId} /> : null}</DragOverlay>
      </DndContext>
    )
  } else {
    return <div>there is an error</div>
  }
}

export default Board
