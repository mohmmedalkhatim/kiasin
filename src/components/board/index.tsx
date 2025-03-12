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
import { useAreas } from '../../context/para/areas'
import "./style.css"
import { IconPlus } from '@tabler/icons-react'

const Board = ({ area }: { area?: Area }) => {
  let [schema, setSchema] = useState(area?.ui_schema.item)
  let [sort, updateSort] = useState(schema?.map(item => item.id.toString()))
  const [activeId, setActiveId] = useState<string | null>(null)
  let update = useAreas((state) => state.update)
  let editable = useAreas((state) => state.eidtable)
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
      setSchema(newSchema)
      update({ ...area, ui_schema: { item: newSchema } } as Area)
      updateSort(newSort)
    }
    setActiveId(null)
  }
  const handlesizeChange = (id: number, operation: { Col: "col" | "row", increase: boolean }) => {
    let card = schema?.find(item => id == item.id);
    let filetred = schema?.filter((item) => item?.id != id) as Cardtype[];
    if (card) {
      switch (operation.Col) {
        case "col": {
          if (operation.increase) {
            card.cols = card.cols + 1;

          } else {
            card.cols = Math.max(1, card.cols - 1)
          }
          break;
        }

        case "row": {
          if (operation.increase) {
            card.rows = card.rows + 1;
          } else {
            card.rows = Math.max(1, card.rows - 1)
          }
          break;
        }
        default: () => { }
      }
      let newschema = [...filetred, card]
      let sorted = sort?.map(id => {
        return newschema?.find(item => item.id == Number(id)) as Cardtype
      }) as Cardtype[]
      setSchema(sorted)
      update({ ...area, ui_schema: { item: sorted } } as Area)
    }
  }


  if (sort && schema) {
    let handleadding = () => {
      let newSchema = { item: [...schema, { id: schema?.length, cols: 1, rows: 1, title: "new" }] }
      update({ ...area, ui_schema: newSchema } as Area)
      setSchema(newSchema.item as Cardtype[])
      updateSort([...sort, String(schema?.length)])
    }
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
              <Card cla={activeId === String(item.id) ? 'dragging' : ''} key={String(item.id)} id={String(item.id)} card={item} setCardlist={handlesizeChange} />
            ))}
            {editable ? <div className='col-span-2 row-span-2 m_border flex justify-center items-center'>
              <button onClick={handleadding}>
                <IconPlus size={20} />
              </button>
            </div> : null}
          </Grid>
        </SortableContext>
        <DragOverlay>{activeId ? <Card cla='' setCardlist={() => { }} id={activeId} card={undefined} /> : null}</DragOverlay>
      </DndContext>
    )
  }
}

export default Board
