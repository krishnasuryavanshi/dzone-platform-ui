import { Flex, Spin } from 'antd';
import React from 'react';

/**
 * A centered full-width spinner used as a page/section loader.
 */
export const ScreenLoader: React.FC = () => (
  <Flex align='center' justify='center' style={{ width: '100%', height: '100%', minHeight: '12rem' }}>
    <Spin size='large' />
  </Flex>
);
