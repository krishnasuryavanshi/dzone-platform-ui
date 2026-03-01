import { type FC, useEffect, useMemo, useState } from 'react';
import { Select } from 'antd';
import { debounce } from 'lodash-es';
import type { IFilterCampaign } from '../../lib/types';
import { getSelectedItems } from '../../lib/utils';

interface CampaignsDropdownProps {
  availableCampaigns: IFilterCampaign[];
  selectedCampaigns?: string[];
  handleSelectionChange: (data: { type: string; selectedItems: string[] }) => void;
}

export const CampaignsDropdown: FC<CampaignsDropdownProps> = ({
  availableCampaigns,
  selectedCampaigns,
  handleSelectionChange,
}) => {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (selectedCampaigns && !selectedCampaigns.includes('all')) {
      const campaignKeys = availableCampaigns.map((c) => c.key);
      const validItems = selectedCampaigns.filter((id) => campaignKeys.includes(id));
      handleSelectionChange({ type: 'selectedCampaigns', selectedItems: validItems });
    }
  }, [availableCampaigns]);

  const options = useMemo(() => {
    return availableCampaigns
      .filter(
        (c) =>
          c.key === 'all' || c.name?.toLowerCase().includes(searchText.toLowerCase()),
      )
      .map((c) => ({
        label: c.key === 'all' ? `All Campaigns (${availableCampaigns.length - 1})` : c.name,
        value: c.key,
      }));
  }, [availableCampaigns, searchText]);

  const handleChange = (values: string[]) => {
    const selectedItems = getSelectedItems(selectedCampaigns || [], values);
    handleSelectionChange({ type: 'selectedCampaigns', selectedItems });
  };

  const debouncedSearch = useMemo(() => debounce((v: string) => setSearchText(v), 300), []);

  const displayLabel = selectedCampaigns?.includes('all')
    ? 'All Campaigns'
    : `${selectedCampaigns?.length || 0} Campaigns`;

  return (
    <div>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder={displayLabel}
        value={selectedCampaigns}
        onChange={handleChange}
        onSearch={debouncedSearch}
        showSearch
        filterOption={false}
        options={options}
        maxTagCount={0}
        maxTagPlaceholder={displayLabel}
      />
    </div>
  );
};
