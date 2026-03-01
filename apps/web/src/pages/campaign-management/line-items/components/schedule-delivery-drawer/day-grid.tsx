import React from 'react';
import { Flex, Space } from 'antd';
import { DayCell } from './day-cell';

interface DayGridProps {
  value?: number;
  onDayClick: (day: number) => void;
}

export const DayGrid: React.FC<DayGridProps> = ({ value, onDayClick }) => {
  return (
    <Flex
      vertical
      style={{
        background: 'var(--dzone-color-white)',
        padding: 'var(--dzone-spacing-sm)',
        border: '1px solid var(--dzone-color-border)',
        boxShadow: 'var(--dzone-shadow-sm)',
        borderRadius: 'var(--dzone-radius-md)',
      }}>
      <Space size='small' direction='vertical'>
        <Flex
          wrap='wrap'
          gap='small'
          style={{ maxWidth: 'var(--dzone-width-dropdown-lg)' }}>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
            <DayCell
              key={day}
              day={day}
              isSelected={value === day}
              onClick={onDayClick}
            />
          ))}
        </Flex>
      </Space>
    </Flex>
  );
};
