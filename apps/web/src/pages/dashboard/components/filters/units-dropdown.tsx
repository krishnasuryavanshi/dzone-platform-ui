import { type FC, type ReactNode } from 'react';
import { Select } from 'antd';

const unitLabels: Record<string, string> = {
  Revenue: 'Revenue',
  Leads: 'Leads',
  LineItems: 'Line Items',
  Campaigns: 'Campaigns',
};

interface UnitsDropdownProps {
  allUnits?: { key: string; label: ReactNode }[];
  selectedUnit?: string[];
  handleSelectionChange?: (data: { type: string; selectedItems: string[] }) => void;
}

export const UnitsDropdown: FC<UnitsDropdownProps> = ({
  allUnits,
  selectedUnit,
  handleSelectionChange,
}) => {
  const options = (allUnits || []).map((u) => ({
    label: unitLabels[u.key] || u.key,
    value: u.key,
  }));

  return (
    <Select
      style={{ width: '100%' }}
      value={selectedUnit?.[0]}
      onChange={(value) =>
        handleSelectionChange?.({ type: 'selectedUnit', selectedItems: [value] })
      }
      options={options}
    />
  );
};
