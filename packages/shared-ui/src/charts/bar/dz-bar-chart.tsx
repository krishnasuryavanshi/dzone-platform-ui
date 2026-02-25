import { FC, useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  LabelList,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Skeleton } from 'antd';
import { DzTooltip } from '../dz-tooltip';

interface IBarChartData {
  name: string;
  value: number;
}

interface IDzBarChartProps {
  data: IBarChartData[];
  loaded?: boolean;
  emptyContent?: React.ReactNode;
  activeBarColor?: string;
}

const Y_AXIS_LABEL_CHARS = 12;

export const DzBarChart: FC<IDzBarChartProps> = ({
  data,
  loaded,
  emptyContent,
  activeBarColor = '#323131',
}) => {
  const [barData, setBarData] = useState<IBarChartData[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      setBarData(data.filter((item) => item.value > 0));
    }
  }, [data]);

  if (!loaded) return <Skeleton active paragraph={{ rows: 4 }} />;
  if (loaded && barData.length === 0) return emptyContent ?? null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={barData}
        layout="vertical"
        barSize={272 / data.length}
        barGap={4}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tickLine={false}
          axisLine={false}
          cursor="pointer"
          tickMargin={16}
          allowDataOverflow
          tick={{ fontSize: '0.75rem', fontWeight: 400, fill: '#000' }}
          tickFormatter={(name) =>
            name.length > Y_AXIS_LABEL_CHARS ? `${name.slice(0, Y_AXIS_LABEL_CHARS)}...` : name
          }
        />
        <Tooltip
          cursor={false}
          content={({ active, payload }) => (
            <DzTooltip chartType="bar" active={active} payload={payload} />
          )}
        />
        <Bar
          dataKey="value"
          radius={4}
          fill="#5D88FF"
          style={{ cursor: 'pointer' }}
          activeBar={<Rectangle fill={activeBarColor} />}
        >
          <LabelList dataKey="value" position="insideLeft" fill="white" fontSize="0.75rem" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
