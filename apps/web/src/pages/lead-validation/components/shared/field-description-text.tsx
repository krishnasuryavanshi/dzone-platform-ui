import { type FC } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

export const FieldDescriptionText: FC<{ config: Record<string, any> }> = ({ config }) => (
  <div style={{ paddingLeft: '0.5rem' }}>
    <Text style={{ fontSize: '0.875rem' }}>{config?.data || ''}</Text>
  </div>
);
