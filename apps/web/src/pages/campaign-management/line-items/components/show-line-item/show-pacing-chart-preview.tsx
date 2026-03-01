import React, { useState } from 'react';
import { Button } from 'antd';
import { IPacingChartType } from '../../lib/types';
import { PacingChartDrawer } from '../create-new-line-item/pacing-chart/drawer';

interface ShowPacingChartPreviewProps {
  value?: IPacingChartType[];
  label?: string;
}

export const ShowPacingChartPreview: React.FC<ShowPacingChartPreviewProps> = ({
  value = [],
  label: _label,
}) => {
  const [open, setOpen] = useState(false);

  if (!Array.isArray(value) || value.length === 0) return null;

  return (
    <>
      <Button type='link' style={{ padding: 0 }} onClick={() => setOpen(true)}>
        View
      </Button>
      <PacingChartDrawer
        open={open}
        onClose={() => setOpen(false)}
        pacingSchedule={value}
      />
    </>
  );
};
