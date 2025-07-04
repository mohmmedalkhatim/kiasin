// components/Card.tsx
import React from 'react';
import styled from 'styled-components';
import {
  IconChevronsDown,
  IconChevronsLeft,
  IconChevronsRight,
  IconChevronsUp,
  IconTrashFilled,
} from '@tabler/icons-react';
import { Card as Cardtype } from '../../types/area';
import { useAreas } from '../../context/para/areas';
import CardContent from '../CardContent';
import { get_card_cols } from '../../util';

const CardContainer = styled.div<{
  rowSpan: number;
  colSpan: number;
  isDragging?: boolean;
}>`
  grid-row: span ${props => props.rowSpan};
  grid-column: auto / span ${props => props.colSpan};
  border: 1px solid #e2e2e215;
  outline-right: ${props => (props.isDragging ? '2px solid #ddd' : 'none')};
  transition: all 0.3s ease;
  position: relative;
  opacity: ${props => (props.isDragging ? 0.5 : 1)};
  overflow-y: auto;
`;

const CardHeader = styled.div`
  cursor: grab; /* Indicate that this area is draggable */
  display: flex;
  align-items: center;
  justify-content: space-between;
  transform: none !important;
`;

interface CardProps {
  id: string;
  cla: string;
  card: Cardtype | undefined;
  container_width: number;
  setSort: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  setCardlist: (
    id: number,
    operation: { Col: 'col' | 'row'; increase: boolean }
  ) => void;
}
const Card: React.FC<CardProps> = ({
  id,
  cla,
  card,
  setCardlist,
  setSort,
  container_width,
}) => {
  const editable = useAreas(state => state.editable);
  const delete_card = useAreas(state => state.delete_card);

  if (card) {
    return (
      <CardContainer
        rowSpan={card.rows}
        colSpan={get_card_cols(card.cols, container_width)}
        className={`relative rounded-xs ${cla} card`}
      >
        {editable && (
          <div className='flex items-center bg-sky-600 absolute z-10 w-full justify-between px-4 py-4'>
            <div className='flex gap-2'>
              <div className='flex gap-2'>
                <div
                  className='flex items-center'
                  onClick={() =>
                    setCardlist(card.id, { Col: 'row', increase: false })
                  }
                >
                  <IconChevronsUp />
                </div>
                <div
                  onClick={() =>
                    setCardlist(card.id, { Col: 'row', increase: true })
                  }
                >
                  <IconChevronsDown />
                </div>
              </div>
              <div className='flex gap-2'>
                <div
                  onClick={() =>
                    setCardlist(card.id, { Col: 'col', increase: false })
                  }
                >
                  <IconChevronsLeft />
                </div>
                <div
                  onClick={() =>
                    setCardlist(card.id, { Col: 'col', increase: true })
                  }
                >
                  <IconChevronsRight />
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                delete_card(Number(id), setSort);
              }}
            >
              <IconTrashFilled />
            </div>
          </div>
        )}
        {card.type && (
          <CardContent id={Number(id)} T={card.type} props={card.props} />
        )}
      </CardContainer>
    );
  }
};
export default Card;
