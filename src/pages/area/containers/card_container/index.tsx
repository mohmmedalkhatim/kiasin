import React from 'react';
import "./index.css";
import { useSelector } from 'react-redux';
import { RootState } from '../../../../contexts/store';
import CardController from './card_controller';
import * as motion from "motion/react-client"

interface CardContainerProps {
  id: number,
  columns: number,
  rows?: number,
};

function CardContainer({ children, columns = 1, rows = 1, ...props }: CardContainerProps & React.HTMLAttributes<HTMLDivElement>) {
  let editing = useSelector((state: RootState) => state.area.active.edit)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`card_container relative ${props.className || ''}`}
      style={{ gridColumn: `span ${columns}`, gridRow: `span ${rows}` }}
    >
      {editing && <CardController id={props.id} />}
      {children}
    </motion.div>
  )
}

export default CardContainer
