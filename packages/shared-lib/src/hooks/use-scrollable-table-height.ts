import { useEffect, useState } from 'react';
import { useWindowDimensions } from './use-window-dimensions';

export const useScrollableTableHeight = (staticContentHeight: number) => {
  const { screenHeight } = useWindowDimensions();
  const [scrollableTableHeight, setScrollableTableHeight] = useState(0);

  useEffect(() => {
    setScrollableTableHeight(screenHeight - staticContentHeight);
  }, [screenHeight]);

  return { scrollableTableHeight };
};
