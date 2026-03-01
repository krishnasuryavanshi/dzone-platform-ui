import { type FC, type ReactNode } from 'react';
import { Select } from 'antd';

interface DurationDropdownProps {
  availableDurations?: { key: string; label: ReactNode }[];
  selectedDurations?: string[];
  handleSelectionChange?: (data: { type: string; selectedItems: string[] }) => void;
}

export const DurationDropdown: FC<DurationDropdownProps> = ({
  availableDurations,
  selectedDurations,
  handleSelectionChange,
}) => {
  const options = (availableDurations || []).map((d) => ({
    label: d.key === 'week' ? 'This Week' : d.key === 'month' ? 'This Month' : d.key === 'quarter' ? 'This Quarter' : 'This Year',
    value: d.key,
  }));

  return (
    <Select
      style={{ width: '100%' }}
      value={selectedDurations?.[0]}
      onChange={(value) =>
        handleSelectionChange?.({ type: 'selectedDurations', selectedItems: [value] })
      }
      options={options}
    />
  );
};
