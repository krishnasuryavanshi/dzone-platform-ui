import { Hideable } from '@dzone/shared-ui';
import { LeadActionsEnum } from '@dzone/shared-lib';
import { usePermissionCheck } from '@dzone/shared-auth';
import { FC, useState } from 'react';
// TODO: Import from leads module once migrated
// import { LeadsList } from '../../../leads/components/leads-list';
// import { ILead } from '../../../leads/lib/types';
import { LeadReviewDrawer } from './review-lead';

// TODO: Re-enable once LeadsList is migrated
// type Filters<T> = Record<string, any>;
// const HiddenColumns = ['clientId', 'campaignId', 'lineItemId'];
// const StaticContentHeight = 300;

interface ILeadsGridContainerProps {
  lineItemId: string;
  leadStatuses: string[];
  validationStatuses: string[];
  refreshLeadsList: () => void;
  isSelectable?: boolean;
  onSelectionChange?: (selectedIds: number[]) => void;
  tenantCode?: string;

  filteredInfo: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const LeadsGridContainer: FC<ILeadsGridContainerProps> = ({
  lineItemId,
  leadStatuses,
  validationStatuses,
  refreshLeadsList,
  // TODO: Re-enable once LeadsList is migrated
  // isSelectable,
  // onSelectionChange,
  tenantCode,
  // filteredInfo,
  // onFiltersChange,
}) => {
  const [isLeadReviewDrawerOpen, setIsLeadReviewDrawerOpen] = useState(false);
  const [currentLeadTrackingId] = useState<string>('');
  const [currentLeadId] = useState<number>(0);

  // TODO: Re-enable once LeadsList is migrated
  // const hasUpdatePermission = usePermissionCheck(LeadActionsEnum.Update);
  // const hasValidateLeadsPermission = usePermissionCheck(
  //   LeadActionsEnum.ValidateLead,
  // );
  // const leadsList = useLeadsStore((state) => state.leadsList);
  // const onLeadRowClick = (record: any) => {
  //   if (hasUpdatePermission || hasValidateLeadsPermission) {
  //     setCurrentLeadTrackingId(record.trackingId);
  //     setCurrentLeadId(record.id);
  //     setIsLeadReviewDrawerOpen(true);
  //   } else {
  //     setIsLeadReviewDrawerOpen(false);
  //   }
  // };

  const onDrawerClose = () => {
    setIsLeadReviewDrawerOpen(false);
    refreshLeadsList();
  };

  return (
    <>
      {/* TODO: Import LeadsList from leads module once migrated */}
      {/* <LeadsList
        list={leadsList}
        lineItemId={lineItemId}
        hiddenColumns={HiddenColumns}
        fixedContentHeight={StaticContentHeight}
        handleRowClick={onLeadRowClick}
        isSelectable={isSelectable}
        onSelectionChange={onSelectionChange}
        highlightCurrentRow={hasUpdatePermission || hasValidateLeadsPermission}
        filterInfo={filteredInfo}
        onFiltersChange={onFiltersChange}
        hasFilters
      /> */}
      <Hideable show={usePermissionCheck(LeadActionsEnum.ValidateLead)}>
        <LeadReviewDrawer
          currentLeadTrackingId={currentLeadTrackingId}
          currentLeadId={currentLeadId}
          lineItemId={lineItemId}
          leadStatuses={leadStatuses}
          validationStatuses={validationStatuses}
          isOpen={isLeadReviewDrawerOpen}
          handleClose={onDrawerClose}
          tenantCode={tenantCode}
        />
      </Hideable>
    </>
  );
};
