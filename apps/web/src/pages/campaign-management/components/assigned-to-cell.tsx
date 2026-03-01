import { FC, useEffect, useState } from 'react';
import { Flex } from 'antd';
import { ICollaborator } from '../lib/types';
import { AssignedToEditCell } from './assigned-to-edit-cell';
import { AssignedToViewCell } from './assigned-to-view-cell';

interface IAssignedToCellProps {
  value: ICollaborator[];
  record: Record<string, any>;
}

export const AssignedToCell: FC<IAssignedToCellProps> = ({ value, record }) => {
  const [assignedTo, setAssignedTo] = useState<ICollaborator[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setAssignedTo(value?.length > 0 ? value : []);
  }, [value]);

  useEffect(() => {
    setIsVisible(!!record?.id);
    setIsEditing(false);
  }, [record?.id]);

  const getTenantCode = () => record.tenantCode as string;

  const updateAssignedTo = async (collaboratorsIds: string[]) => {
    try {
      const requestData = { assignedTo: collaboratorsIds };
      let result;
      if (record.lineItemId) {
        const { updateLineItemCollaborators } = await import('../line-items/services');
        result = await updateLineItemCollaborators(requestData, record.id);
      } else {
        const { updateCampaignCollaborators } = await import('../campaigns/services');
        result = await updateCampaignCollaborators(requestData, record.id);
      }
      setAssignedTo(result?.data?.collaborators?.assignedTo);
      return true;
    } catch {
      return false;
    }
  };

  if (!isVisible) return null;

  return (
    <Flex onClick={(e) => e.stopPropagation()}>
      {!isEditing ? (
        <AssignedToViewCell value={assignedTo} enableEditMode={() => setIsEditing(true)} />
      ) : (
        <AssignedToEditCell
          value={assignedTo}
          enableViewMode={() => setIsEditing(false)}
          onUpdate={updateAssignedTo}
          isLineItem={!!record.lineItemId}
          tenantCode={getTenantCode()}
        />
      )}
    </Flex>
  );
};
