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

} from '@dnd-kit/sortable'
import { useState } from 'react'
import Grid from './main/Grid'
import Card from './main/Card'
import { Area, Card as Cardtype } from '../../types/area'
import { SwappingStrategy } from './Strategy'
import { Channel, invoke } from '@tauri-apps/api/core'

const Board = ({ area }: { area?: Area }) => {
  let [schema, setShema] = useState(area?.ui_schema.item)
  let [sort, updateSort] = useState(schema?.map(item => item.id.toString()))
  const [activeId, setActiveId] = useState<string | null>(null)

  // Configure sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = async (event: any) => {
    if (event.active.id !== event.over.id && sort) {
      const oldIndex = sort?.indexOf(event.active.id)
      const newIndex = sort?.indexOf(event.over.id)
      let newSort = arrayMove(sort, oldIndex, newIndex);
      let newSchema = newSort.map((id) => schema?.find(item => String(item.id) == id) || {} as Cardtype)
      let channel = new Channel()
      setShema(newSchema)
      updateSort(newSort)
      await invoke('area_control', { command: "update", payload: { id: area?.id, item: { ...area, ui_schema: { item: newSchema } } as Area }, channel })
    }
    setActiveId(null)
  }

  if (sort) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sort} strategy={SwappingStrategy}>
          <Grid columns={8}>
            {schema?.map(item => (
              <Card cla={activeId === String(item.id) ? 'dragging' : ''} key={String(item.id)} id={String(item.id)} element={item} />
            ))}
          </Grid>
        </SortableContext>
        <DragOverlay>{activeId ? <Card cla='' id={activeId} element={undefined} /> : null}</DragOverlay>
      </DndContext>
    )
  }
}

export default Board
