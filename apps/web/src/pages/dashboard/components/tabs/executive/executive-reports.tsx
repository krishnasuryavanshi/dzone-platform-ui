import { type FC } from 'react';
import { Col, Row } from 'antd';
import { useAuthStore } from '@dzone/shared-store';
import { RestrictedAccessKeys } from '@dzone/shared-lib';
import { ExecutiveReportType } from '../../../lib/enums';
import { ExecutiveReportCard } from './cards/executive-report-card';
import { ExecutiveGrids } from './executive-grid/executive-grid';

interface ExecutiveReportsProps {
  show: boolean;
}

export const ExecutiveReports: FC<ExecutiveReportsProps> = ({ show }) => {
  const { user } = useAuthStore();
  const restrictedKeys = user?.restrictedAccessKeys || [];

  const restrictedAccessMap: Record<string, boolean> = {
    [ExecutiveReportType.Scheduled]: restrictedKeys.includes(
      RestrictedAccessKeys.ScheduledInExecutiveDasboard,
    ),
    [ExecutiveReportType.Delivered]: restrictedKeys.includes(
      RestrictedAccessKeys.DeliveredInExecutiveDasboard,
    ),
    [ExecutiveReportType.Invoiced]: restrictedKeys.includes(
      RestrictedAccessKeys.InvoicedInExecutiveDasboard,
    ),
  };

  if (!show) return null;

  return (
    <>
      <Row gutter={[12, 12]}>
        {(Object.values(ExecutiveReportType) as string[]).map((key) => {
          const hasAccess =
            !(key in restrictedAccessMap) || restrictedAccessMap[key];
          return (
            <Col key={key} xxl={4} xl={4} lg={6} md={8} sm={24} xs={24}>
              {hasAccess ? <ExecutiveReportCard type={key} /> : null}
            </Col>
          );
        })}
      </Row>
      <ExecutiveGrids />
    </>
  );
};
