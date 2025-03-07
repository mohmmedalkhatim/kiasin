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
  arrayMove,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useState } from 'react'
import Grid from './main/Grid'
import Card from './main/Card'
import { Area } from '../../types/area'

const Board = ({ area }: { area?: Area }) => {
  let [schema,setShema] = useState(area?.ui_schema)
  let [sort, updateSort] = useState(schema?.item.map(item => item.id.toString()))
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
    if (event.active.id !== event.over.id && sort) {
      const oldIndex = sort?.indexOf(event.active.id)
      const newIndex = sort?.indexOf(event.over.id)
      updateSort(arrayMove(sort, oldIndex, newIndex))
    }
    setActiveId(null)
  }

  let elements = schema?.item.map(item => (
    <Card cla={activeId === String(item.id) ? 'dragging' : ''} key={item.id} id={String(item.id)} element={item} />
  ))
  if(sort){
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sort} strategy={horizontalListSortingStrategy || verticalListSortingStrategy}>
          <Grid columns={8}>
            {elements}
          </Grid>
        </SortableContext>
        <DragOverlay>{activeId ? <Card cla='' id={activeId} element={undefined} /> : null}</DragOverlay>
      </DndContext>
    ) 
  }
}

export default Board
