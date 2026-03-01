import { type FC } from 'react';
import { Col, Row } from 'antd';
import { MapFunction } from '@dzone/shared-ui';
import { useAuthStore } from '@dzone/shared-store';
import { RestrictedAccessKeys } from '@dzone/shared-lib';
import { PerformanceCountsType } from '../../../lib/enums';
import { CountReportCard } from '../shared/count-report-card';

export const PerformanceCountsContainer: FC = () => {
  const { user } = useAuthStore();
  const hasAverageTimePacingAccess = user?.restrictedAccessKeys?.includes(
    RestrictedAccessKeys.AverageTimeinPacingReserved,
  );

  const countsKeys = [
    PerformanceCountsType.NumberOfContactsGenerated,
    PerformanceCountsType.NumberOfLeadsDelivered,
    PerformanceCountsType.PercentageOfContactsThatBecomeDeliverableLeads,
    PerformanceCountsType.AverageTimeFromCampaignCreationToFirstLeadDelivery,
    PerformanceCountsType.AverageTimeFromContactResearchToQualityAudit,
    PerformanceCountsType.AverageTimeFromQaReadyToLeadDelivery,
    ...(hasAverageTimePacingAccess
      ? [PerformanceCountsType.AverageTimeInPacingReserved]
      : []),
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
