import { DZONE_CLR_BLACK } from '@dzone/shared-lib';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { FC } from 'react';
import styles from './refresh.module.css';

interface IRefreshProps {
  onRefresh: () => void;
}

export const Refresh: FC<IRefreshProps> = ({ onRefresh }) => {
  return (
    <Button
      onClick={onRefresh}
      style={{
        height: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.25rem',
        border: `1px solid ${DZONE_CLR_BLACK}`,
      }}
      className={styles.refreshButton}>
      <ReloadOutlined />
    </Button>
  );
};
