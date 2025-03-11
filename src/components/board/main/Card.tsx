// components/Card.tsx
import React from 'react'
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
import { Card as Cardtype } from '../../../types/area';

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
  card: Cardtype | undefined
  setCardlist: (id: number, operation: { Col: "col" | "row", increase: boolean }) => void
}

const Card: React.FC<CardProps> = ({
  id, cla, card, setCardlist
}) => {

  const { attributes, listeners, setNodeRef, transform, isDragging, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (card) {
    return (
      <CardContainer
        ref={setNodeRef}
        style={style}
        rowSpan={card.rows}
        colSpan={card.cols}
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
              <div className='size_control'>
                <button onClick={() => setCardlist(card.id, { Col: "row", increase: false })}>
                  <IconRowRemove />
                </button>
                <button onClick={() => setCardlist(card.id, { Col: "row", increase: true })}>
                  <IconRowInsertBottom />
                </button>
              </div>
              <div>
                <button onClick={() => setCardlist(card.id, { Col: "col", increase: false })}>
                  <IconLayoutSidebarLeftCollapseFilled />
                </button>
                <button onClick={() => setCardlist(card.id, { Col: "col", increase: true })}>
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
