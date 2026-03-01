import { IUser } from '../../../../ums/users/lib/types';
import { fetchAssignedUsersInModule } from '../../../../ums/users/services';
import { RestrictedAccessKeys } from '@dzone/shared-lib';
import { useRestrictedAccess } from '../../../campaigns/lib/hooks/use-restricted-access';
import { useEffect, useState } from 'react';
import { fetchLineItemStatuses } from '../../services';
import { LineItemFields } from '../enums';

export function useLineItemFilterOptions(
  hasFilters?: boolean,
  assignedTo?: string,
) {
  const [options, setOptions] = useState({
    isReady: false,
    dynamicFilters: {},
    hiddenColumns: [] as LineItemFields[],
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [dynamicFilters, setDynamicFilters] = useState<any>({});

  const isCplColumnHidden = useRestrictedAccess(
    RestrictedAccessKeys.CplColumnInLineItemList,
  );

  useEffect(() => {
    if (!assignedTo || assignedTo === 'all') {
      setUserId(null);
    } else {
      setUserId(assignedTo);
    }
  }, [assignedTo]);

  useEffect(() => {
    if (isCplColumnHidden) {
      setOptions((prev) => ({
        ...prev,
        hiddenColumns: [LineItemFields.TargetCostPerLead],
      }));
    }
  }, [isCplColumnHidden]);

  useEffect(() => {
    if (hasFilters) {
      fetchDynamicFilters();
    } else if (hasFilters === false) {
      // hasFilters could be undefined
      setOptions((prev) => ({ ...prev, isReady: true, dynamicFilters: {} }));
    }
  }, [hasFilters]);

  useEffect(() => {
    if (userId) {
      const currentUser = dynamicFilters?.[
        LineItemFields.AssignedTo
      ]?.filters?.find((user: any) => user.value === userId);
      setOptions((prev) => ({
        ...prev,
        dynamicFilters: {
          ...dynamicFilters,
          [LineItemFields.AssignedTo]: {
            isDynamicOptions: true,
            filters: [currentUser],
            isDisabled: true,
          },
        },
      }));
    } else {
      setOptions((prev) => ({ ...prev, dynamicFilters }));
    }
  }, [userId, dynamicFilters]);

  const fetchDynamicFilters = async () => {
    const statuses = await fetchLineItemStatuses();
    const { data: assignedToUsers } =
      await fetchAssignedUsersInModule('Line Item');
    const dynamicFilters = {
      [LineItemFields.Status]: {
        isDynamicOptions: true,
        filters: statuses,
      },
      [LineItemFields.AssignedTo]: {
        isDynamicOptions: true,
        filters: assignedToUsers.map((user: IUser) => ({
          text: `${user.firstName} ${user.lastName}`,
          value: user.id,
        })),
      },
    };
    setDynamicFilters(dynamicFilters);
    setOptions((prev) => ({ ...prev, dynamicFilters, isReady: true }));
  };

  return options;
}
