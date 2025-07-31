import { ReactNode } from 'react';
import { UseMeasureRef } from 'react-use/lib/useMeasure';

export function Container ({
  children,
  ref,
}: {
  children: ReactNode;
  ref: UseMeasureRef<HTMLDivElement>;
}) {
  return (
    <div className='GridContainer' ref={ref}>
      {children}
    </div>
  );
}
export default Container;
