import React from 'react';
import "./index.css";
import { useSelector } from 'react-redux';
import { RootState } from '../../../../contexts/store';
import CardController from './card_controller';

interface CardContainerProps {
  id: number,
  columns: number,
  rows?: number,
};

function CardContainer({ children, columns = 1, rows = 1, ...props }: CardContainerProps & React.HTMLAttributes<HTMLDivElement>) {
  let editing = useSelector((state: RootState) => state.area.active.edit)
  return (
    <div
      className={`card_container relative grid_animation ${props.className || ''}`}
      style={{ gridColumn: `span ${columns}`, gridRow: `span ${rows}` }}
    >
      {editing && <CardController id={props.id} />}
      {children}
    </div>
  )
}

export default CardContainer
