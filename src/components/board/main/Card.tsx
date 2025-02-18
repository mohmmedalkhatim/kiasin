// components/Card.tsx
import React, { useState } from 'react'
import styled from 'styled-components'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  IconLayoutSidebarLeftCollapseFilled,
  IconLayoutSidebarLeftExpandFilled,
  IconRowInsertBottom,
  IconRowRemove
} from '@tabler/icons-react'
import { useLayout } from '../../../context/page_schema'

const CardContainer = styled.div<{
  rowSpan: number
  colSpan: number
  isDragging?: boolean
}>`
  grid-row: span ${props => props.rowSpan};
  grid-column: span ${props => props.colSpan};
  border: 1px solid #e2e2e220;
  padding: 16px;
  background-color: ${props => (props.isDragging ? '#ddd' : '#181818')};
  transition: all 0.3s ease;
  opacity: ${props => (props.isDragging ? 0.5 : 1)};
`

const CardHeader = styled.div`
  cursor: grab; /* Indicate that this area is draggable */
`

interface CardProps {
  id: string
}

const Card: React.FC<CardProps> = ({
  id,
}) => {

  let { list, updateCard: update, tauri } = useLayout()
  let element = list?.find(item => item.id.toString() == id)
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform)
  }

  if (element) {
    return (
      <CardContainer
        ref={setNodeRef}
        style={style}
        rowSpan={element.rows}
        colSpan={element.cols}
        isDragging={isDragging}
        {...attributes}
        className='relative rounded'
      >
        <CardHeader {...listeners}>
          <h3>Card {id}</h3>
        </CardHeader>
        <div className=' flex absolute'>
          <div>
            <button onClick={() => { element.rows = Math.max(1, element.rows - 1); update(tauri, element) }}>
              <IconRowRemove />
            </button>
            <button onClick={() => { element.rows = element.rows + 1; console.log(element);update(tauri, element) }}>
              <IconRowInsertBottom />
            </button>
          </div>
          <div>
            <button onClick={() => { element.cols = Math.max(1, element.cols - 1); update(tauri, element) }}>
              <IconLayoutSidebarLeftCollapseFilled />
            </button>
            <button onClick={() => { element.cols = element.cols + 1; update(tauri, element) }}>
              <IconLayoutSidebarLeftExpandFilled />
            </button>
          </div>
        </div>
      </CardContainer>
    )
  }
}
export default Card
