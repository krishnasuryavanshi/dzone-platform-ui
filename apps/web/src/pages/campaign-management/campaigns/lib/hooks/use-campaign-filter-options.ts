import { apiClient } from '@dzone/shared-auth';
import { ApiHost, RestrictedAccessKeys } from '@dzone/shared-lib';
import { useEffect, useState, useRef } from 'react';
import { fetchCampaignStatuses } from '../../services';
import { CampaignField } from '../enums';
import { useRestrictedAccess } from './use-restricted-access';

interface IAssignedUser {
  id: string;
  firstName: string;
  lastName: string;
  [key: string]: any;
}

async function fetchAssignedUsersInModule(moduleName: string) {
  const { data } = await apiClient.get(
    `${ApiHost.RBACService}/users/module/${moduleName}`,
  );
  return data;
}

export function useCampaignFilterOptions(
  hasFilters?: boolean,
  assignedTo?: string,
) {
  const [options, setOptions] = useState({
    isReady: false,
    dynamicFilters: {},
    hiddenColumns: [] as CampaignField[],
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [dynamicFilters, setDynamicFilters] = useState<any>({});
  const hasFetchedRef = useRef(false);

  const isIONumberColumnHidden = useRestrictedAccess(
    RestrictedAccessKeys.IONumberColumnInCampaignList,
  );

  useEffect(() => {
    if (!assignedTo || assignedTo === 'all') {
      setUserId(null);
    } else {
      setUserId(assignedTo);
    }
  }, [assignedTo]);

  useEffect(() => {
    if (isIONumberColumnHidden) {
      setOptions((prev) => ({
        ...prev,
        hiddenColumns: [CampaignField.IoNumber],
      }));
    }
  }, [isIONumberColumnHidden]);

  useEffect(() => {
    if (hasFilters && !hasFetchedRef.current) {
      fetchDynamicFilters();
      hasFetchedRef.current = true;
    }
  }, [hasFilters]);

  useEffect(() => {
    if (userId) {
      const currentUser = dynamicFilters?.[
        CampaignField.AssignedTo
      ]?.filters?.find((user: any) => user.value === userId);
      setOptions((prev) => ({
        ...prev,
        dynamicFilters: {
          ...dynamicFilters,
          [CampaignField.AssignedTo]: {
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
    try {
      const [statuses, assignedUsersResponse] = await Promise.all([
        fetchCampaignStatuses(),
        fetchAssignedUsersInModule('Campaign'),
      ]);

      const { data: assignedToUsers } = assignedUsersResponse;

      const dynamicFilters = {
        [CampaignField.Status]: {
          isDynamicOptions: true,
          filters: statuses,
        },
        [CampaignField.AssignedTo]: {
          isDynamicOptions: true,
          filters: assignedToUsers.map((user: IAssignedUser) => ({
            text: `${user.firstName} ${user.lastName}`,
            value: user.id,
          })),
        },
      };
      setDynamicFilters(dynamicFilters);
      setOptions((prev) => ({ ...prev, dynamicFilters, isReady: true }));
    } catch (error) {
      setOptions((prev) => ({ ...prev, isReady: true }));
    }
  };

  return options;
}
