import { type FC, useEffect, useMemo, useState } from 'react';
import { Select } from 'antd';
import { debounce } from 'lodash-es';
import type { IFilterLineItem } from '../../lib/types';
import { getSelectedItems } from '../../lib/utils';

interface LineItemsDropdownProps {
  availableLineItems: IFilterLineItem[];
  selectedLineItems?: string[];
  handleSelectionChange: (data: { type: string; selectedItems: string[] }) => void;
}

export const LineItemsDropdown: FC<LineItemsDropdownProps> = ({
  availableLineItems,
  selectedLineItems,
  handleSelectionChange,
}) => {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (selectedLineItems && !selectedLineItems.includes('all')) {
      const lineItemKeys = availableLineItems.map((li) => li.key);
      const validItems = selectedLineItems.filter((id) => lineItemKeys.includes(id));
      handleSelectionChange({ type: 'selectedLineItems', selectedItems: validItems });
    }
  }, [availableLineItems]);

  const options = useMemo(() => {
    return availableLineItems
      .filter(
        (li) =>
          li.key === 'all' || li.name?.toLowerCase().includes(searchText.toLowerCase()),
      )
      .map((li) => ({
        label: li.key === 'all' ? `All Line Items (${availableLineItems.length - 1})` : li.name,
        value: li.key,
      }));
  }, [availableLineItems, searchText]);

  const handleChange = (values: string[]) => {
    const selectedItems = getSelectedItems(selectedLineItems || [], values);
    handleSelectionChange({ type: 'selectedLineItems', selectedItems });
  };

  const debouncedSearch = useMemo(() => debounce((v: string) => setSearchText(v), 300), []);

  const displayLabel = selectedLineItems?.includes('all')
    ? 'All Line Items'
    : `${selectedLineItems?.length || 0} Line Items`;

  return (
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder={displayLabel}
      value={selectedLineItems}
      onChange={handleChange}
      onSearch={debouncedSearch}
      showSearch
      filterOption={false}
      options={options}
      maxTagCount={0}
      maxTagPlaceholder={displayLabel}
    />
  );
};
