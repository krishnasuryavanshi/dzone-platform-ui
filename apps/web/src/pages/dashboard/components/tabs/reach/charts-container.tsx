import { type FC } from 'react';
import { Row } from 'antd';
import { LeadsByJobTitle } from './charts/leads-by-job-title';
import { LeadsByCountry } from './charts/leads-by-country';
import { Pacing } from './charts/pacing';

export const ReachChartsContainer: FC = () => {
  return (
    <Row gutter={[16, 16]}>
      <LeadsByJobTitle />
      <LeadsByCountry />
      <Pacing />
    </Row>
  );
};
