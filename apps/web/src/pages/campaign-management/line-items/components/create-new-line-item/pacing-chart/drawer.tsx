import { FC } from 'react';
import { DZONE_CLR_BLACK } from '@dzone/shared-lib';
import { Drawer } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { PacingLists } from './pacing-lists';
import { IPacingChartType } from '../../../lib/types';

interface PacingChartDrawerProps {
  open: boolean;
  onClose: () => void;
  pacingSchedule: IPacingChartType[];
}

export const PacingChartDrawer: FC<PacingChartDrawerProps> = ({
  open,
  onClose,
  pacingSchedule,
}) => {
  return (
    <Drawer
      title={<span style={{ color: '#fff' }}>Pacing Chart</span>}
      placement='right'
      width={800}
      style={{ borderRadius: '0.5rem 0.5rem 0 0' }}
      onClose={onClose}
      open={open}
      styles={{
        header: {
          background: DZONE_CLR_BLACK,
        },
      }}
      closeIcon={
        <CloseOutlined
          style={{
            color: '#fff',
          }}
        />
      }>
      <PacingLists pacingData={pacingSchedule} />
    </Drawer>
  );
};
