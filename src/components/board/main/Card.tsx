// components/Card.tsx
import React, { useState } from 'react'
import styled from 'styled-components'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const CardContainer = styled.div<{
  rowSpan: number
  colSpan: number
  isDragging?: boolean
}>/*css*/ `
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
  defaultRowSpan?: number
  defaultColSpan?: number
}

const Card: React.FC<CardProps> = ({
  id,
  defaultRowSpan = 1,
  defaultColSpan = 1
}) => {
  const [rowSpan, setRowSpan] = useState(defaultRowSpan)
  const [colSpan, setColSpan] = useState(defaultColSpan)

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform)
  }

  return (
    <CardContainer
      ref={setNodeRef}
      style={style}
      rowSpan={rowSpan}
      colSpan={colSpan}
      isDragging={isDragging}
      {...attributes}
    >
      {/* Attach listeners only to the header */}
      <CardHeader {...listeners}>
        <h3>Card {id}</h3>
      </CardHeader>
      <div>
        <button onClick={() => setRowSpan(prev => Math.max(1, prev - 1))}>
          - Row
        </button>
        <span>{rowSpan}</span>
        <button onClick={() => setRowSpan(prev => prev + 1)}>+ Row</button>
      </div>
      <div>
        <button onClick={() => setColSpan(prev => Math.max(1, prev - 1))}>
          - Col
        </button>
        <span>{colSpan}</span>
        <button onClick={() => setColSpan(prev => prev + 1)}>+ Col</button>
      </div>
    </CardContainer>
  )
}

export default Card
