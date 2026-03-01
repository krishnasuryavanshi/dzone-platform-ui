import { type FC } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

export const FieldNote: FC<{ config: Record<string, any> }> = ({ config }) => (
  <div style={{ paddingLeft: '0.5rem' }}>
    <Text style={{ fontSize: '0.875rem' }} strong>
      {config?.data?.header || ''}{' '}
    </Text>{' '}
    <Text style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
      {config?.data?.text || ''}{' '}
    </Text>
  </div>
);
