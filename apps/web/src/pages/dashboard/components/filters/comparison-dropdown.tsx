import { type FC, type ReactNode } from 'react';
import { Select } from 'antd';

const timeFrameLabels: Record<string, string> = {
  MTD: 'MTD vs MTD',
  LM: 'Last Month vs Same Month',
  QTD: 'QTD vs QTD',
  LQ: 'Last Quarter vs Same Quarter',
  YTD: 'YTD vs YTD',
};

interface ComparisonDropdownProps {
  allTimeFrame?: { key: string; label: ReactNode }[];
  selectedTimeFrame?: string[];
  handleSelectionChange?: (data: { type: string; selectedItems: string[] }) => void;
}

export const ComparisonDropdown: FC<ComparisonDropdownProps> = ({
  allTimeFrame,
  selectedTimeFrame,
  handleSelectionChange,
}) => {
  const options = (allTimeFrame || []).map((tf) => ({
    label: timeFrameLabels[tf.key] || tf.key,
    value: tf.key,
  }));

  return (
    <Select
      style={{ width: '100%' }}
      value={selectedTimeFrame?.[0]}
      onChange={(value) =>
        handleSelectionChange?.({ type: 'selectedTimeFrame', selectedItems: [value] })
      }
      options={options}
    />
  );
};
