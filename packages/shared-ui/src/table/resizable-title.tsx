import { type FC, type MouseEvent, useState, useCallback } from 'react';

export interface ResizableTitleProps {
  onResize: (width: number) => void;
  width: number;
  [key: string]: any;
}

export const ResizableTitle: FC<ResizableTitleProps> = (props) => {
  const { onResize, width, ...restProps } = props;
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    startX: number;
    startWidth: number;
  }>({
    isDragging: false,
    startX: 0,
    startWidth: 0,
  });

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragState({ isDragging: true, startX: e.clientX, startWidth: width });
    },
    [width],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging) return;
      const deltaX = e.clientX - dragState.startX;
      const newWidth = dragState.startWidth + deltaX;
      if (onResize && newWidth > 0) {
        onResize(newWidth);
      }
    },
    [dragState, onResize],
  );

  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      setDragState((prev) => ({ ...prev, isDragging: false }));
    }
  }, [dragState.isDragging]);

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <>
      <th {...restProps} style={{ ...restProps.style, position: 'relative' }}>
        {restProps.children}
        <div
          className={`column-resize-handle ${dragState.isDragging ? 'resizing' : ''}`}
          onMouseDown={handleMouseDown}
          style={{ cursor: 'col-resize', userSelect: 'none' }}
        />
      </th>
      {dragState.isDragging && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            cursor: 'col-resize',
            userSelect: 'none',
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      )}
    </>
  );
};
