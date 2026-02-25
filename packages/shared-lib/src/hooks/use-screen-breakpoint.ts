import { Grid } from 'antd';
import { useEffect, useState } from 'react';

const { useBreakpoint } = Grid;

export const useScreenBreakpoint = () => {
  const [current, setCurrent] = useState('');
  const { xs, sm, md, lg, xl, xxl } = useBreakpoint();

  useEffect(() => {
    let currentSize = '';
    if (xxl) {
      currentSize = 'xxl';
    } else if (xl) {
      currentSize = 'xl';
    } else if (lg) {
      currentSize = 'lg';
    } else if (md) {
      currentSize = 'md';
    } else if (sm) {
      currentSize = 'sm';
    } else if (xs) {
      currentSize = 'xs';
    }

    if (current !== currentSize) {
      setCurrent(currentSize);
    }
  }, [xs, sm, md, lg, xl, xxl]);

  return { xs, sm, md, lg, xl, xxl, currentScreenSize: current };
};
