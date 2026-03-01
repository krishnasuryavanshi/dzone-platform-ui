import { Flex } from 'antd';
import { ICollaborator } from '../../types';
import styles from './collaborator-name.module.css';

export const collaboratorNameRenderer = (value: ICollaborator) => {
  return (
    <Flex className={styles.collaboratorNameRender}>
      {`${value?.firstName || ''} ${value?.lastName || ''}`}
    </Flex>
  );
};

export const assignedToNamesRenderer = (
  value: ICollaborator[],
  _record: Record<string, any>,
) => {
  if (!value || value.length === 0) return null;
  const names = value.map((c) => `${c?.firstName || ''} ${c?.lastName || ''}`);
  return <span>{names.join(', ')}</span>;
};
