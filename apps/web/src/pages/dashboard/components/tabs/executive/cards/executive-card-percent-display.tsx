import { type FC } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface PercentDisplayProps {
  percent: string;
  isPositive?: boolean | null;
}

export const PercentDisplay: FC<PercentDisplayProps> = ({
  percent,
  isPositive,
}) => {
  let textColor = '#000';
  if (isPositive === true) {
    textColor = '#90BE6D';
  } else if (isPositive === false) {
    textColor = '#F64C4C';
  }

  return (
    <Text
      style={{
        fontSize: '1.5rem',
        fontWeight: 500,
        color: textColor,
        lineHeight: 'normal',
      }}
    >
      {percent}
    </Text>
  );
};
