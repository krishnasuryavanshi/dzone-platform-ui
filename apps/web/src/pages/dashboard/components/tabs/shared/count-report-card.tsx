import { type FC } from 'react';
import { useFetchReportData } from '../../../hooks';
import { CountCard } from './count-card';

type StringRecord = Record<string, string>;

interface CountReportCardProps {
  type: string;
}

export const CountReportCard: FC<CountReportCardProps> = ({ type }) => {
  const [countData] = useFetchReportData<StringRecord>({}, type, 'count');
  return (
    <CountCard
      title={(countData as StringRecord)?.name}
      value={(countData as StringRecord)?.value}
    />
  );
};
