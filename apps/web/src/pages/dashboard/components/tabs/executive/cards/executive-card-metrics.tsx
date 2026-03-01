import { type FC } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface IRecord {
  name: string;
  value: string;
}

interface ExecutiveCardMetricsProps {
  data: IRecord;
  record?: IRecord;
  isPrevious?: boolean;
}

export const ExecutiveCardMetrics: FC<ExecutiveCardMetricsProps> = ({
  data,
  record,
  isPrevious,
}) => {
  const valueFontSize = isPrevious ? '0.875rem' : '1.5rem';

  return (
    <>
      <Text
        style={{
          fontSize: '0.625rem',
          fontWeight: 500,
          color: '#000',
          lineHeight: 'normal',
        }}
      >
        {data?.name}
      </Text>
      <Text
        style={{
          fontSize: valueFontSize,
          fontWeight: 500,
          color: '#000',
          lineHeight: 'normal',
        }}
      >
        {data?.value || record?.value}
      </Text>
    </>
  );
};
