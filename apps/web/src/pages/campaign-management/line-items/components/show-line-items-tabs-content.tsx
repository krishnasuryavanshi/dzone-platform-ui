import { FC, useState, useCallback } from 'react';
import { Flex } from 'antd';
import { usePermissionCheck } from '@dzone/shared-auth';
import {
  DeliveryTemplateActionsEnum,
  LeadActionsEnum,
} from '@dzone/shared-lib';
import { ShowLeads } from './show-leads';
import { LineItemsTabType } from '../lib/enums';
import { LineItemsFilesContainer } from './line-items-files-container';
import { ScheduledDeliveryBar } from './scheduled-delivery-bar';
import { DeliverySchedulesList } from './delivery-schedules';
import { DeliverySchedule } from '../services';
import { JobsContainer } from '../../../jobs/components';

interface IShowLineTabsContent {
  activeTab: string;
  lineItemId: string;
  tenantCode?: string;
  sessionTenantCode?: string | string[];
}

export const ShowLineItemsTabsContent: FC<IShowLineTabsContent> = ({
  activeTab,
  lineItemId,
  tenantCode,
  sessionTenantCode,
}) => {
  const [schedulesCount, setSchedulesCount] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const canViewLeads = usePermissionCheck(LeadActionsEnum.View);
  const canViewDeliveryTemplates = usePermissionCheck(
    DeliveryTemplateActionsEnum.View,
  );
  const canScheduleDelivery = usePermissionCheck(
    LeadActionsEnum.ScheduleDelivery,
  );

  const processedSessionTenantCode = Array.isArray(sessionTenantCode)
    ? sessionTenantCode.join(',')
    : sessionTenantCode;

  const handleScheduleCreated = () => {
    // Trigger refresh by updating the refresh trigger
    setRefreshTrigger((prev) => prev + 1);
  };

  // State for edit handler from bar
  const [barEditHandler, setBarEditHandler] = useState<
    ((schedule: DeliverySchedule) => void) | null
  >(null);

  const handleRegisterEditHandler = useCallback(
    (handler: (schedule: DeliverySchedule) => void) => {
      setBarEditHandler(() => handler);
    },
    [],
  );

  return (
    <>
      {canViewLeads && (
        <ShowLeads
          show={activeTab === LineItemsTabType.Leads}
          lineItemId={lineItemId}
          tenantCode={tenantCode}
        />
      )}
      <LineItemsFilesContainer show={activeTab === LineItemsTabType.Files} />
      {canViewDeliveryTemplates && (
        <>
          {activeTab === LineItemsTabType.Delivery && (
            <>
              <ScheduledDeliveryBar
                show={true}
                scheduledCount={schedulesCount}
                lineItemId={lineItemId}
                tenantCode={processedSessionTenantCode}
                onScheduleCreated={handleScheduleCreated}
                onRegisterEditHandler={handleRegisterEditHandler}
              />
              {canScheduleDelivery && (
                <Flex style={{ marginTop: '-0.5rem' }}>
                  <DeliverySchedulesList
                    lineItemId={lineItemId}
                    onSchedulesLoaded={setSchedulesCount}
                    refreshTrigger={refreshTrigger}
                    onEditSchedule={(schedule) => barEditHandler?.(schedule)}
                  />
                </Flex>
              )}
            </>
          )}
        </>
      )}
      {activeTab === LineItemsTabType.Jobs && (
        <JobsContainer
          lineItemId={lineItemId}
          showHeader={false}
          hideLineItemColumn={true}
        />
      )}
    </>
  );
};
