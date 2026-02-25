import { FC, useEffect, useState } from 'react';
import {
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Skeleton } from 'antd';
import { DzTooltip } from '../dz-tooltip';

const ADDITIONAL_PERCENTAGE = 0.01;
const Y_AXIS_LABEL_CHARS = 15;

interface IFunnelData {
  value: number;
  status?: string;
  name: string;
  percent: string;
  validValue?: number;
}

interface IDzFunnelChartProps {
  data: IFunnelData[];
  loaded?: boolean;
  emptyContent?: React.ReactNode;
  activeBarColor?: string;
}

export const DzFunnelChart: FC<IDzFunnelChartProps> = ({
  data,
  loaded,
  emptyContent,
  activeBarColor = '#323131',
}) => {
  const [funnelData, setFunnelData] = useState<IFunnelData[]>([]);

  useEffect(() => {
    if (data.length && data[0].value !== 0) {
      const additionalValue = Math.ceil(data[0].value * ADDITIONAL_PERCENTAGE);
      setFunnelData(data.map((item) => ({ ...item, validValue: item.value + additionalValue })));
    } else {
      setFunnelData([]);
    }
  }, [data]);

  if (!loaded) return <Skeleton active paragraph={{ rows: 4 }} />;
  if (loaded && funnelData.length === 0) return emptyContent ?? null;

  const renderLabel = (props: any) => {
    const { y, height, name } = props;
    return (
      <text
        x={0}
        y={y + height / 2}
        fill="black"
        textAnchor="start"
        dominantBaseline="central"
        fontSize="0.75rem"
        fontWeight={400}
        height={height}
        width={100}
      >
        {name.length > Y_AXIS_LABEL_CHARS ? `${name.slice(0, Y_AXIS_LABEL_CHARS)}...` : name}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <FunnelChart>
        <Tooltip
          content={({ active, payload }) => (
            <DzTooltip chartType="funnel" active={active} payload={payload} />
          )}
        />
        <Funnel
          shape={<Rectangle fill="#5D88FF" radius={4} />}
          activeShape={<Rectangle fill={activeBarColor} radius={4} />}
          fill={activeBarColor}
          dataKey="validValue"
          radius={4}
          style={{ cursor: 'pointer' }}
          data={funnelData}
          width="70%"
          isAnimationActive
          legendType="circle"
        >
          <LabelList
            position="middle"
            fill="#FFF"
            stroke="none"
            dataKey="value"
            fontSize="0.75rem"
            fontWeight={400}
          />
          <LabelList
            content={renderLabel}
            position="left"
            fill="#000"
            stroke="none"
            dataKey="name"
            fontSize="0.75rem"
            fontWeight={400}
            offset={10}
          />
          <Legend />
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
};
