import { FC, SyntheticEvent } from 'react';
import { Flex } from 'antd';
import { CollaboratorName } from './collaborator-name';
import { ICollaborator } from '../lib/types';

interface IAssignedToViewCellProps {
  value: ICollaborator[];
  enableEditMode: () => void;
}

export const AssignedToViewCell: FC<IAssignedToViewCellProps> = ({ value, enableEditMode }) => {
  const handleEnableEditMode = (e: SyntheticEvent) => {
    e.stopPropagation();
    enableEditMode();
  };

  return (
    <Flex onDoubleClick={handleEnableEditMode} style={{ minWidth: '100px', minHeight: '30px' }}>
      <CollaboratorName collaborator={value} label="Assigned To" />
    </Flex>
  );
};
