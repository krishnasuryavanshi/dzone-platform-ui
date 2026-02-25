import { FC } from 'react';
import { Flex, Typography } from 'antd';

const { Text } = Typography;

interface IDzTooltipProps {
  active?: boolean;
  payload: any;
  chartType?: 'pie' | 'bar' | 'funnel';
  prependDollarInLabel?: boolean;
}

export const DzTooltip: FC<IDzTooltipProps> = ({
  active,
  payload,
  chartType = 'pie',
  prependDollarInLabel = false,
}) => {
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
    backgroundColor: chartType === 'bar' ? payload[0].fill : payload[0].payload.fill,
  };

  let { name, value, payload: payLoad } = payload[0];

  if (chartType === 'bar') name = payLoad?.name;
  if (chartType === 'funnel') {
    name = payLoad?.status;
    value = payLoad?.value;
  }

  const percent = payLoad?.payload?.percent;

  return (
    <div style={wrapperStyle}>
      <Flex gap="0.5rem" align="center">
        <div style={indicatorStyle} />
        <Text style={{ fontSize, fontWeight: 400 }}>
          {name}:
          <Text style={{ fontSize, fontWeight: 500, marginLeft: '0.125rem' }}>
            {prependDollarInLabel ? `$${value}` : value}
            {percent ? (
              <Text style={{ fontSize, fontWeight: 500, marginLeft: '0.125rem' }}>
                ({percent})
              </Text>
            ) : null}
          </Text>
        </Text>
      </Flex>
    </div>
  );
};
