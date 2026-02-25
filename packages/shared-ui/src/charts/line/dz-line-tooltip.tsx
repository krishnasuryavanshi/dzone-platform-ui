import { FC } from 'react';
import { Flex, Typography } from 'antd';

const { Text } = Typography;

interface IDzLineTooltipProps {
  active?: boolean;
  payload: any;
}

export const DzLineTooltip: FC<IDzLineTooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const fontSize = '0.75rem';

  const wrapperStyle = {
    backgroundColor: '#fff',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
  };

  const indicatorStyle = {
    height: '0.5rem',
    width: '0.375rem',
    borderRadius: '1px',
  };

  return (
    <div style={wrapperStyle}>
      <Flex gap="0.5rem" align="flex-start" vertical>
        {payload.map(({ color, name, value }: any) => (
          <Flex gap="0.5rem" align="center" key={`${name}-${value}`}>
            <div style={{ ...indicatorStyle, backgroundColor: color }} />
            <Text style={{ fontSize, fontWeight: 400 }}>
              {name}:<Text style={{ fontSize, fontWeight: 500, marginLeft: '0.125rem' }}>{value}</Text>
            </Text>
          </Flex>
        ))}
      </Flex>
    </div>
  );
};
