import { type FC } from 'react';
import { Col, Row } from 'antd';
import { MapFunction } from '@dzone/shared-ui';
import { ReachCountsType } from '../../../lib/enums';
import { CountReportCard } from '../shared/count-report-card';

export const ReachCountsContainer: FC = () => {
  const countsKeys = [
    ReachCountsType.LeadsDelivered,
    ReachCountsType.UniqueAccountsReached,
  ];

  return (
    <Row gutter={16}>
      <MapFunction
        items={countsKeys}
        renderItem={(key: string) => (
          <Col key={key} xxl={6} xl={6} lg={8} md={8} sm={12} xs={24} style={{ marginBottom: '1rem' }}>
            <CountReportCard type={key} />
          </Col>
        )}
      />
    </Row>
  );
};
