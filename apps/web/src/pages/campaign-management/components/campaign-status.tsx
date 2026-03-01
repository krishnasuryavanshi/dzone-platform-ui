import React, { CSSProperties, FC } from 'react';
import { Typography, Flex } from 'antd';
import { IStatus } from '../lib/types';

const { Text } = Typography;

// TODO: Import StatusMetaLineItems from line-items/lib/utils when available in 5C
const StatusMetaLineItems = (
  _status: { value: string },
): { backgroundColor: string; color: string; icon: React.ReactNode } | null => {
  // Placeholder - will be replaced with actual implementation in 5C
  return { backgroundColor: '#f0f0f0', color: '#333', icon: null };
};

const Status: FC<{ name: string; value: string; iconStyles?: CSSProperties }> = ({
  value,
  iconStyles,
}) => {
  if (!value) return null;
  const currentStatus = StatusMetaLineItems({ value });
  if (!currentStatus) return null;

  const styles: CSSProperties = {
    backgroundColor: currentStatus.backgroundColor,
    color: currentStatus.color,
    padding: '0.5rem',
    borderRadius: '4px',
    height: '2rem',
    width: '11rem',
    boxShadow: '0px 0px 4px rgba(35, 90, 237, 0.16)',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <Flex align="center" style={styles} gap="0.5rem">
      <span style={{ ...iconStyles, color: currentStatus.color }}>{currentStatus.icon}</span>
      <Text style={{ fontWeight: 400, color: currentStatus.color, fontSize: '0.875rem' }}>
        {value}
      </Text>
    </Flex>
  );
};

interface ICampaignStatusProps {
  status: IStatus;
}

export const CampaignStatus: FC<ICampaignStatusProps> = ({ status }) => {
  if (status?.name === 'LIVE') {
    return <Status name={status?.name} value={status?.value} iconStyles={{ height: '1.25rem' }} />;
  }
  return <Status name={status?.name} value={status?.value} />;
};
