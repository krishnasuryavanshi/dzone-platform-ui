import { FC, useEffect, useState } from 'react';
import { Select, Button, Flex } from 'antd';
import { CheckOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { ICollaborator } from '../lib/types';

interface IAssignedToEditCellProps {
  value: ICollaborator[];
  enableViewMode: () => void;
  onUpdate: (collaboratorsId: string[]) => Promise<boolean>;
  isLineItem?: boolean;
  tenantCode: string;
}

export const AssignedToEditCell: FC<IAssignedToEditCellProps> = ({
  value,
  enableViewMode,
  onUpdate,
  isLineItem,
  tenantCode,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (value?.length > 0) setSelectedIds(value.map((item) => item.id));
  }, [value]);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleUpdate = async () => {
    setIsLoading(true);
    const isUpdated = await onUpdate(selectedIds);
    setIsLoading(false);
    if (isUpdated) enableViewMode();
  };

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      // TODO: Import fetchUsersWithModuleAccess from ums/users/services when available
      const { fetchUsersWithModuleAccess } = await import('../../ums/users/services');
      const { data } = await fetchUsersWithModuleAccess(
        isLineItem ? 'Line Item' : 'Campaign',
        tenantCode,
      );
      setOptions(
        data.map((user: any) => ({ label: `${user.firstName} ${user.lastName}`, value: user.id })),
      );
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const filterOptions = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  if (isLoading) {
    return (
      <Flex align="center" justify="center">
        <LoadingOutlined />
      </Flex>
    );
  }

  return (
    <Flex onClick={(e) => e.stopPropagation()} style={{ marginTop: '-0.25rem' }}>
      <Flex gap="0.25rem" align="center">
        <Flex style={{ flex: 1 }}>
          <Select
            placeholder="Select"
            value={selectedIds}
            onChange={(val) => setSelectedIds(val)}
            options={options}
            filterOption={filterOptions as any}
            maxTagCount="responsive"
            maxTagPlaceholder={(omittedValues) => (
              <span style={{ display: 'inline-block', cursor: 'pointer' }}>
                {`+ ${omittedValues.length} more`}
              </span>
            )}
            size="small"
            style={{ width: '100%', height: '2rem' }}
            mode="multiple"
          />
        </Flex>
        <Button onClick={handleUpdate} size="small" type="primary">
          <CheckOutlined />
        </Button>
        <Button onClick={enableViewMode} size="small" type="default">
          <CloseOutlined />
        </Button>
      </Flex>
    </Flex>
  );
};
