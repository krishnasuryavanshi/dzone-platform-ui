import React from 'react';
import { Flex, Typography } from 'antd';

const { Text } = Typography;

interface DayCellProps {
  day: number;
  isSelected: boolean;
  onClick: (day: number) => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  day,
  isSelected,
  onClick,
}) => {
  return (
    <Flex
      onClick={() => onClick(day)}
      style={{
        width: 'var(--dzone-spacing-6xl)',
        height: 'var(--dzone-spacing-6xl)',
        cursor: 'pointer',
        border: isSelected
          ? '1px solid var(--dzone-color-primary)'
          : '1px solid var(--dzone-color-border-light)',
        backgroundColor: isSelected
          ? 'var(--dzone-color-primary)'
          : 'var(--dzone-color-white)',
      }}>
      <Flex justify='center' align='center' style={{ height: '100%' }}>
        <Text
          style={{
            color: isSelected
              ? 'var(--dzone-color-white)'
              : 'var(--dzone-color-gray-dark)',
          }}>
          {day}
        </Text>
      </Flex>
    </Flex>
  );
};
