import { FC } from 'react';
import { Typography } from 'antd';
import { isArray } from 'lodash-es';
import { ICollaborator } from '../lib/types';

const { Text } = Typography;

interface ICollaboratorNameProps {
  collaborator: ICollaborator | ICollaborator[];
  label?: string;
}

export const CollaboratorName: FC<ICollaboratorNameProps> = ({ collaborator }) => {
  if (!isArray(collaborator)) {
    return <Text>{`${collaborator?.firstName || ''} ${collaborator?.lastName || ''}`}</Text>;
  }

  const collaboratorNames = collaborator.map(
    (c) => `${c?.firstName || ''} ${c?.lastName || ''}`,
  );

  return <Text ellipsis={{ tooltip: collaboratorNames.join(', ') }}>{collaboratorNames.join(', ')}</Text>;
};
