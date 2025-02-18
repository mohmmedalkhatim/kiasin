// components/Card.tsx
import React, { useState } from 'react'
import styled from 'styled-components'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  IconGridDots,
  IconLayoutSidebarLeftCollapseFilled,
  IconLayoutSidebarLeftExpandFilled,
  IconRowInsertBottom,
  IconRowRemove
} from '@tabler/icons-react'
import { useLayout } from '../../../context/page_schema'
import Icon from '../../Icon'

const CardContainer = styled.div<{
  rowSpan: number
  colSpan: number
  isDragging?: boolean
}>`
  grid-row: span ${props => props.rowSpan};
  grid-column: span ${props => props.colSpan};
  border: 1px solid #e2e2e220;
  padding: 16px;
  outline-right: ${props => (props.isDragging ? '2px solid #ddd' : 'none')};
  transition: all 0.3s ease;
  opacity: ${props => (props.isDragging ? 0.5 : 1)};
`

const CardHeader = styled.div`
  cursor: grab; /* Indicate that this area is draggable */
  display:flex;
  align-items:center;
  justify-content:space-between;
  transform: none !important;
`

interface CardProps {
  id: string
  cla: string
}

const Card: React.FC<CardProps> = ({
  id,cla
}) => {

  let { list, updateCard: update, tauri } = useLayout()
  let element = list?.find(item => item.id.toString() == id)
  const { attributes, listeners, setNodeRef, transform, isDragging, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
        className={`relative rounded ${cla} card`} 
      >
        <div className='flex items-center justify-between'>
          <CardHeader {...listeners}>
            <IconGridDots />
          </CardHeader>

          <div>
            <div className='flex'>
              <div>
                <button onClick={() => { element.rows = Math.max(1, element.rows - 1); update(tauri, element) }}>
                  <IconRowRemove />
                </button>
                <button onClick={() => { element.rows = element.rows + 1; console.log(element); update(tauri, element) }}>
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
          </div>
        </div>
      </CardContainer>
    )
  }
}
export default Card
