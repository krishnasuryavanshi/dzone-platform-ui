import { useState, useRef, useEffect, useCallback } from 'react';
import { Flex, Modal, Typography, notification } from 'antd';
import { SimplePagination } from '@dzone/shared-ui';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useQueryState } from '@dzone/shared-lib';
import { Hideable } from '@dzone/shared-ui';
import { useOrganizations, useUpdateOrganization } from '../hooks';
import { OrgList } from './org-list';
import { OrgListHeader } from './org-list-header';
import { DEFAULT_PAGE_SIZE } from '../lib/constants';
import type {
  IOrganization,
  IOrganizationFilters,
  IOrganizationSorter,
} from '../lib/types';

const { Text } = Typography;

export const OrgContainer = () => {
  const { queryState, setQueryState } = useQueryState();
  const [modal, contextHolder] = Modal.useModal();

  const pageNo = Number(queryState.page) || 1;
  const pageSize = Number(queryState.pageSize) || DEFAULT_PAGE_SIZE;

  const [filters, setFilters] = useState<IOrganizationFilters>({});
  const [sorter, setSorter] = useState<IOrganizationSorter>({});
  const filtersRef = useRef(filters);
  const sorterRef = useRef(sorter);

  // Sync query params on first render if missing
  useEffect(() => {
    if (!queryState.page || !queryState.pageSize) {
      setQueryState([
        { name: 'page', value: pageNo },
        { name: 'pageSize', value: pageSize },
      ]);
    }
  }, []);

  const { data } = useOrganizations(
    pageNo - 1,
    pageSize,
    filters,
    sorter,
  );

  const updateMutation = useUpdateOrganization();

  const organizations: IOrganization[] = (data?.data ?? []).map(
    (org: IOrganization) => ({ ...org, key: org.id }),
  );
  const totalRecords: number = data?.total ?? 0;

  const handlePageChange = (page: number, size: number) => {
    setQueryState([
      { name: 'page', value: page },
      { name: 'pageSize', value: size },
    ]);
  };

  const handleFiltersChange = useCallback(
    (newFilters: IOrganizationFilters) => {
      setFilters(newFilters);
      filtersRef.current = newFilters;
      // Reset to page 1 when filters change
      setQueryState([
        { name: 'page', value: 1 },
        { name: 'pageSize', value: pageSize },
      ]);
    },
    [pageSize, setQueryState],
  );

  const handleSorterChange = useCallback(
    (newSorter: IOrganizationSorter) => {
      setSorter(newSorter);
      sorterRef.current = newSorter;
      setQueryState([
        { name: 'page', value: 1 },
        { name: 'pageSize', value: pageSize },
      ]);
    },
    [pageSize, setQueryState],
  );

  const handleToggleStatus = (org: IOrganization) => {
    const status = org.status?.name;
    if (status === 'INACTIVE') {
      updateStatus(org, 'ACTIVE');
    } else {
      confirmDeactivate(org);
    }
  };

  const confirmDeactivate = (org: IOrganization) => {
    modal.confirm({
      closable: true,
      title: 'Deactivating the organization',
      icon: <ExclamationCircleOutlined style={{ color: '#E04149' }} />,
      content: (
        <Text>
          Deactivating this organization (
          <Text style={{ color: '#3D71FB' }}>{org.name}</Text>) will
          immediately revoke their access and permissions. Do you want to
          proceed?
        </Text>
      ),
      okText: 'Deactivate',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: () => updateStatus(org, 'INACTIVE'),
    });
  };

  const updateStatus = (org: IOrganization, status: string) => {
    updateMutation.mutate(
      { organizationId: org.id!, payload: { status } },
      {
        onSuccess: (res) => {
          notification.success({ message: res?.message ?? 'Status updated' });
        },
        onError: () => {
          notification.error({ message: 'Failed to update status' });
        },
      },
    );
  };

  return (
    <Flex vertical gap="1rem" style={{ height: '100%' }}>
      <OrgListHeader
        filters={filters}
        onClearFilters={() => handleFiltersChange({})}
      />
      <Flex vertical style={{ flex: 1 }}>
        <OrgList
          organizations={organizations}
          onToggleStatus={handleToggleStatus}
          filters={filters}
          sorter={sorter}
          onFiltersChange={handleFiltersChange}
          onSorterChange={handleSorterChange}
        />
      </Flex>
      <Hideable show={totalRecords > 0}>
        <SimplePagination
          current={pageNo}
          pageSize={pageSize}
          total={totalRecords}
          onChange={handlePageChange}
        />
      </Hideable>
      {contextHolder}
    </Flex>
  );
};
