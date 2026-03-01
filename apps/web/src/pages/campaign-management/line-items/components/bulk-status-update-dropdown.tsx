import { FC, useEffect, useState } from 'react';
import { notification } from 'antd';
import { DzRadioDropdown } from '@dzone/shared-ui';
import { ILeadStatus } from '../../leads/lib/types';
import { fetchLeadStatusList } from '../../leads/services';
import { leadsStatusUpdate } from '../services';
import { useLeadsStore } from '../stores';

interface IBulkStatusUpdateDropdownProps {
  disabled?: boolean;
  leadIds?: number[];
  tenantCode?: string;
  lineItemId?: string;
  filteredInfo?: Record<string, any>;
}

interface Option {
  label: string;
  value: string;
}

export const BulkStatusUpdateDropdown: FC<IBulkStatusUpdateDropdownProps> = ({
  disabled,
  leadIds,
  tenantCode,
  lineItemId,
  filteredInfo,
}) => {
  const fetchLeadsFromStore = useLeadsStore((state) => state.fetchLeads);
  const setSelectedIds = useLeadsStore((state) => state.setSelectedIds);
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatusData = async () => {
      const data = await fetchLeadStatusList();
      if (data) {
        const leadStatusOptionsList = data?.data
          .filter((item: ILeadStatus) => item.name !== 'Published') // Exclude Published
          .map((item: ILeadStatus) => ({
            value: item.name,
            label: item.value,
          }));
        setOptions(leadStatusOptionsList);
      }
    };
    fetchStatusData();
  }, []);

  const handleStatusChange = async (value: string) => {
    setSelected(value);
    setLoading(true);
    if (leadIds && leadIds.length > 0) {
      await handleBulkStatusUpdate(value, leadIds);
      setSelected(undefined);
    }
    setLoading(false);
  };

  const handleBulkStatusUpdate = async (status: string, leadIds: number[]) => {
    if (!tenantCode || !leadIds.length || !lineItemId) return;
    const leadUpdates = leadIds.map((id) => ({
      id,
      leadStatus: status,
    }));
    try {
      const response = await leadsStatusUpdate(leadUpdates, tenantCode);
      if (response) {
        // Refresh the leads list after status update
        await fetchLeadsFromStore(tenantCode, lineItemId, filteredInfo);
        setSelectedIds([]);
        notification.success({ message: response.message });
      }
    } catch (e) {}
  };

  return (
    <DzRadioDropdown
      label='Status Update'
      options={options}
      onStatusChange={handleStatusChange}
      disabled={disabled || loading}
      selected={selected}
      style={{
        height: '2rem',
      }}
    />
  );
};
