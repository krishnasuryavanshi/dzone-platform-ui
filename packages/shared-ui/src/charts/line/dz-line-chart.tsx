import { FC } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Skeleton } from 'antd';
import { DzLegend } from '../dz-legend';
import { DzLineTooltip } from './dz-line-tooltip';

interface IDzLineChartProps {
  data: Record<string, any>[];
  lines: Record<string, string>[];
  loaded?: boolean;
  emptyContent?: React.ReactNode;
}

export const DzLineChart: FC<IDzLineChartProps> = ({ data, lines, loaded, emptyContent }) => {
  if (!loaded) return <Skeleton active paragraph={{ rows: 4 }} />;
  if (loaded && data.length === 0) return emptyContent ?? null;

  const lineConfig = {
    type: 'monotone' as const,
    dot: false,
    strokeWidth: 2,
    activeDot: { r: 5 },
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis
          dataKey="name"
          tickLine={{ stroke: '#EAF1FF', strokeWidth: 1 }}
          axisLine={{ stroke: '#EAF1FF', strokeWidth: 1 }}
          padding={{ left: 14, right: 14 }}
        />
        <YAxis
          type="number"
          tickLine={false}
          axisLine={false}
          cursor="pointer"
          tickMargin={16}
          strokeWidth={1}
          tickCount={7}
          tickFormatter={(value) =>
            `${value > 999 ? parseFloat(Number(value / 1000).toFixed(2)) + 'k' : value}`
          }
        />
        <CartesianGrid vertical={false} stroke="#EAF1FF" strokeWidth={1} />
        <Tooltip
          cursor={false}
          content={({ active, payload }) => <DzLineTooltip active={active} payload={payload} />}
        />
        <Legend
          content={({ payload }) => <DzLegend payload={payload} placement="bottom" />}
        />
        {lines?.map((line) => (
          <Line key={line.dataKey} {...lineConfig} {...(line as any)} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
