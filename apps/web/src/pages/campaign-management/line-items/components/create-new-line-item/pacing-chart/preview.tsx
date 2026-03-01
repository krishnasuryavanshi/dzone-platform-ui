import { Tooltip, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { DZONE_CLR_BLACK } from '@dzone/shared-lib';
import './preview.css';
import { PacingChartDrawer } from './drawer';
import { IPacingChartType } from '../../../lib/types';

interface IPacingChartPreviewProps {
  pacingSchedule: IPacingChartType[];
}
export const PacingChartPreview: React.FC<IPacingChartPreviewProps> = ({
  pacingSchedule,
}) => {
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip
        overlayClassName='white-arrow-tooltip'
        overlayStyle={{
          whiteSpace: 'wrap',
          background: 'white',
          maxWidth: '12.5rem',
        }}
        overlayInnerStyle={{
          fontSize: '0.875rem',
          textAlign: 'center',
          color: '#000',
          background: '#fff',
        }}
        title='Preview Pacing Chart'
        placement='right'>
        <Button
          type='default'
          icon={<EyeOutlined />}
          style={{
            marginTop: '2.2rem',
            border: `1px solid ${DZONE_CLR_BLACK}`,
            borderRadius: '4px',
          }}
          onClick={() => {
            setOpen(true);
          }}
        />
      </Tooltip>
      <PacingChartDrawer
        open={open}
        onClose={onClose}
        pacingSchedule={pacingSchedule}
      />
    </>
  );
};
