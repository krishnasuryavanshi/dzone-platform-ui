import { type FC } from 'react';
import { Row } from 'antd';
import { InternalRejectRate } from './charts/internal-reject-rate';
import { ClientRejectRate } from './charts/client-reject-rate';
import { InternalRejectionReasons } from './charts/internal-rejection-reasons';
import { LeadStatus } from './charts/lead-status';

export const PerformanceChartsContainer: FC = () => {
  return (
    <Row gutter={[16, 16]}>
      <InternalRejectRate />
      <ClientRejectRate />
      <InternalRejectionReasons />
      <LeadStatus />
    </Row>
  );
};
