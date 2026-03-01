import { useTranslation } from 'react-i18next';
import { Hideable } from '@dzone/shared-ui';
import { LeadActionsEnum } from '@dzone/shared-lib';
import { usePermissionCheck } from '@dzone/shared-auth';
import { hasActiveFilters } from '@dzone/shared-lib';
import { Button, Flex, Tooltip } from 'antd';
import { isEmpty } from 'lodash-es';
import { FC, useEffect, useState } from 'react';
// TODO: Import from leads module once migrated
// import { ILead } from '../../../leads/lib/types';
import { LeadStatusFileType } from '../../lib/enums';
import { useLeadsStore } from '../../stores';
import { LeadStatusDropdown } from '../lead-status-dropdown';
import { LeadsFiltersManager } from './leads-filters-manager';
import { LeadsGridContainer } from './leads-grid-container';
import { LeadsHeader } from './leads-header';
import { LeadsPagination } from './leads-pagination';
import { Refresh } from './refresh';
import { ValidationStatusDropdown } from './validation-status-dropdown';
// TODO: Import from leads module once migrated
// import { useLeadsCountStore } from '../../../leads/store';

// TODO: Re-enable once leads module is fully migrated
// type Filters<T> = Record<string, any>;

interface IShowLeadsProps {
  lineItemId: string;
  show: boolean;
  tenantCode?: string;
}

export const ShowLeads: FC<IShowLeadsProps> = ({
  lineItemId,
  show,
  tenantCode,
}) => {
  const setSelectedIds = useLeadsStore((state) => state.setSelectedIds);
  const leadsData = useLeadsStore((state) => state.leadsData);
  const updateLeadsData = useLeadsStore((state) => state.updateLeadsData);
  const resetLeadsData = useLeadsStore((state) => state.resetLeadsData);
  const fetchLeadsFromStore = useLeadsStore((state) => state.fetchLeads);
  const totalFilteredLeads = useLeadsStore((state) => state.totalFilteredLeads);
  const allowMultiselect = usePermissionCheck([
    LeadActionsEnum.ReturnLeads,
    LeadActionsEnum.PublishLead,
    LeadActionsEnum.StatusUpdate,
    LeadActionsEnum.ArchiveLead,
  ]);
  // TODO: Import from leads module once migrated
  // const setStoreLeadsCount = useLeadsCountStore((state) => state.setTotalLeads);
  const setStoreLeadsCount = (_count: number) => {};

  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});
  const setLeadsList = useLeadsStore((state) => state.setLeadsList);

  const { t } = useTranslation();

  const fetchLeads = () => {
    if (tenantCode) {
      fetchLeadsFromStore(
        tenantCode,
        lineItemId,
        filteredInfo,
        setStoreLeadsCount,
      );
    }
  };

  // Clear leads when lineItemId changes
  useEffect(() => {
    // Clear the leads list immediately when lineItemId changes
    setLeadsList([]);
    setSelectedIds([]);
    resetLeadsData();

    if (!tenantCode || !lineItemId) return;
    fetchLeads();
  }, [lineItemId]);

  // Fetch leads when filters change
  useEffect(() => {
    if (!tenantCode || !lineItemId) return;
    fetchLeads();
  }, [tenantCode, filteredInfo]);

  // Trigger fetch when leads data changes (pagination, status filters, sorting)
  useEffect(() => {
    if (!tenantCode || !lineItemId) return;
    fetchLeads();
  }, [
    leadsData.currentPage,
    leadsData.pageSize,
    leadsData.selectedLeadsStatus,
    leadsData.selectedValidationStatus,
    leadsData.sortBy,
    leadsData.sortOrder,
  ]);

  const handleLeadsStatusChange = (data: string[]) => {
    updateLeadsData({ selectedLeadsStatus: data });
  };

  const handleValidationStatusChange = (data: string[]) => {
    updateLeadsData({ selectedValidationStatus: data });
  };

  const handlePaginationChange = (page: number, size: number) => {
    updateLeadsData({ currentPage: page, pageSize: size });
  };

  const goToFirstPage = () => {
    updateLeadsData({ currentPage: 1 });
  };

  const refreshLeadsList = () => {
    if (leadsData.currentPage === 1) {
      fetchLeads();
    } else {
      goToFirstPage();
    }
  };

  const handleSelectionChange = (selectedLeads: number[]) => {
    setSelectedIds(selectedLeads);
  };

  const handleFiltersChange = (filters: Record<string, any> = {}) => {
    // Extract sorting from filters if present
    const { sortBy, sortOrder, ...actualFilters } = filters;

    setFilteredInfo(actualFilters);

    // Handle sorting if present
    if (sortBy && sortOrder) {
      updateLeadsData({
        sortBy: sortBy[0],
        sortOrder: sortOrder[0] as 'asc' | 'desc',
        currentPage: 1, // Reset to first page on sort change
      });
    } else if (
      !sortBy &&
      !sortOrder &&
      (leadsData.sortBy || leadsData.sortOrder)
    ) {
      // Clear sorting if it was removed
      updateLeadsData({
        sortBy: null,
        sortOrder: null,
        currentPage: 1,
      });
    } else {
      goToFirstPage();
    }
  };

  const handleClearFilters = () => {
    if (!isEmpty(filteredInfo)) {
      handleFiltersChange({});
    }
  };

  const refresh = () => {
    resetLeadsData();
    // Force re-fetch after reset
    fetchLeads();
  };

  if (!show) {
    return null;
  }

  return (
    <>
      <Flex vertical gap={'0.5rem'}>
        <LeadsHeader
          lineItemId={lineItemId}
          totalFilteredLeads={totalFilteredLeads}
          leadStatus={leadsData.selectedLeadsStatus}
          validationStatus={leadsData.selectedValidationStatus}
          refreshLeadsList={refreshLeadsList}
          tenantCode={tenantCode}
        />
        <LeadsFiltersManager>
          <Flex gap={'0.5rem'}>
            <LeadStatusDropdown
              onLeadsStatusChange={handleLeadsStatusChange}
              selected={leadsData.selectedLeadsStatus}
              isFileType={LeadStatusFileType.Leads}
            />
            <Hideable show={usePermissionCheck([LeadActionsEnum.ValidationFilter])}>
              <ValidationStatusDropdown
                onValidationStatusChange={handleValidationStatusChange}
                selected={leadsData.selectedValidationStatus}
                isFileType={LeadStatusFileType.Leads}
              />
            </Hideable>
            <Refresh onRefresh={refresh} />
            <Hideable show={hasActiveFilters(filteredInfo)}>
              <Tooltip title={t('pages.clearFilters')}>
                <Button
                  onClick={handleClearFilters}
                  style={{
                    height: '2.25rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}>
                  {t('Clear Filters')}
                </Button>
              </Tooltip>
            </Hideable>
          </Flex>
        </LeadsFiltersManager>
        <LeadsGridContainer
          isSelectable={allowMultiselect}
          onSelectionChange={handleSelectionChange}
          lineItemId={lineItemId}
          leadStatuses={leadsData.selectedLeadsStatus}
          validationStatuses={leadsData.selectedValidationStatus}
          refreshLeadsList={refreshLeadsList}
          tenantCode={tenantCode}
          filteredInfo={filteredInfo}
          onFiltersChange={handleFiltersChange}
        />
      </Flex>
      <Hideable show={totalFilteredLeads > 0}>
        <LeadsPagination
          currentPage={leadsData.currentPage}
          totalRecords={totalFilteredLeads}
          pageSize={leadsData.pageSize}
          handlePaginationChange={handlePaginationChange}
        />
      </Hideable>
    </>
  );
};
