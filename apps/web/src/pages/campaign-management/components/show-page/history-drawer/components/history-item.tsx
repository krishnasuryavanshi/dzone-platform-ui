import { FC } from 'react';
import { Card, Divider } from 'antd';
import { DiffRenderer } from './diff-renderer';

interface HistoryItemProps {
  entry: any;
  fileMap: Record<string, any>;
  validationSettingMap: Record<string, string>;
}

export const HistoryItem: FC<HistoryItemProps> = ({
  entry,
  fileMap,
  validationSettingMap,
}) => {
  return (
    <Card style={{ border: 'none' }}>
      <DiffRenderer
        diff={entry.diff}
        updatedBy={entry.updatedByName}
        timestamp={entry.timestamp}
        fileMap={fileMap}
        validationSettingMap={validationSettingMap}
      />
      <Divider style={{ margin: '1rem 0' }} />
    </Card>
  );
};
