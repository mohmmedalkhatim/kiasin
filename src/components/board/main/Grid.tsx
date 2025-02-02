import React from 'react';
import styled from 'styled-components';

const GridContainer = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  grid-auto-rows:10rem;
  gap: 16px;
  padding: 16px;
`;

interface GridProps {
  columns: number;
  children: React.ReactNode;
}

const Grid: React.FC<GridProps> = ({ columns, children }) => {
  return <GridContainer columns={columns}>{children}</GridContainer>;
};

export default Grid;