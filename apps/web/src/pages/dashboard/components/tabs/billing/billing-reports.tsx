import { type FC } from 'react';
import { Row } from 'antd';
import { NoOfBillableLeads } from './charts/no-of-billable-leads';
import { DollarAmountForBillableLeads } from './charts/dollar-amount-for-billable-leads';

interface BillingReportsProps {
  show: boolean;
}

export const BillingReports: FC<BillingReportsProps> = ({ show }) => {
  if (!show) return null;
  return (
    <Row gutter={[16, 16]}>
      <NoOfBillableLeads />
      <DollarAmountForBillableLeads />
    </Row>
  );
};
