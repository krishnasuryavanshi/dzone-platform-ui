import { type FC, useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import type {
  IFilterCampaign,
  IFilterLineItem,
  ISelectedIds,
  IFilterDataPayload,
  IExecutiveFilterDataPayload,
} from '../../lib/types';
import { fetchFilterData } from '../../services';
import { calculateDateRanges, transformFilterDataPayload } from '../../lib/utils';
import { ExecutiveUnitType, ReportType, TimeFrameType } from '../../lib/enums';
import { TabBasedFilterManager } from './tab-based-filter-manager';
import { FilterActions } from './filter-actions';
import { Actions } from './actions';

interface ReportingFiltersManagerProps {
  onSubmit: (filterData: IFilterDataPayload | IExecutiveFilterDataPayload) => void;
  activeTab: string;
}

export const ReportingFiltersManager: FC<ReportingFiltersManagerProps> = ({
  onSubmit,
  activeTab,
}) => {
  const { t } = useTranslation();
  const [allLineItems, setAllLineItems] = useState<IFilterLineItem[]>([]);
  const [allCampaigns, setAllCampaigns] = useState<IFilterCampaign[]>([]);
  const [reset, setReset] = useState(0);
  const [submit, setSubmit] = useState(0);
  const [isDownloadDisabled, setIsDownloadDisabled] = useState(false);

  const allUnits = [
    { key: ExecutiveUnitType.Revenue, label: 'Revenue' },
    { key: ExecutiveUnitType.Leads, label: t('Leads') },
    { key: ExecutiveUnitType.LineItems, label: t('Line Items') },
    { key: ExecutiveUnitType.Campaigns, label: t('Campaigns') },
  ];

  const allTimeFrame = [
    { key: TimeFrameType.MTD, label: t('MTD vs MTD') },
    { key: TimeFrameType.LM, label: t('Last Month vs Same Month') },
    { key: TimeFrameType.QTD, label: t('QTD vs QTD') },
    { key: TimeFrameType.LQ, label: t('Last Quarter vs Same Quarter') },
    { key: TimeFrameType.YTD, label: t('YTD vs YTD') },
  ];

  const allDurations = [
    { key: 'week', label: t('This Week') },
    { key: 'month', label: t('This Month') },
    { key: 'quarter', label: t('This Quarter') },
    { key: 'year', label: t('This Year') },
  ];

  useEffect(() => {
    if (activeTab !== ReportType.Executive) {
      fetchReportingFilterData();
    }
    setIsDownloadDisabled(true);
  }, []);

  const fetchReportingFilterData = async () => {
    const { lineItems, campaigns } = await fetchFilterData();
    setAllLineItems(lineItems);
    setAllCampaigns(campaigns);
  };

  const handleSelection = (data: ISelectedIds) => {
    if (
      data.selectedCampaigns &&
      data.selectedLineItems &&
      data.selectedDuration &&
      data.selectedUnit &&
      data.selectedTimeFrame
    ) {
      const selectedCampaigns = allCampaigns
        .filter((c) => data.selectedCampaigns?.includes(c.key))
        .map((c) => ({ campaignId: c.key }));
      const selectedLineItems = allLineItems
        .filter((li) => data.selectedLineItems?.includes(li.key))
        .map((li) => ({ lineItemId: li.key, campaignId: li.campaignId }));

      const range = data.selectedDuration && calculateDateRanges(data.selectedDuration[0]);
      const filterData = transformFilterDataPayload({ selectedCampaigns, selectedLineItems });

      onSubmit({
        campaigns: filterData,
        range,
        unit: data.selectedUnit[0],
        timeframe: data.selectedTimeFrame[0],
      } as IFilterDataPayload & IExecutiveFilterDataPayload);
    }
  };

  return (
    <Row gutter={[12, 12]} align="bottom">
      <Col xs={24} sm={24} md={24} lg={24} xl={activeTab === ReportType.Executive ? 10 : 16} xxl={12}>
        <TabBasedFilterManager
          activeTab={activeTab}
          allLineItems={allLineItems}
          allCampaigns={allCampaigns}
          allDurations={allDurations}
          allUnits={allUnits}
          allTimeFrame={allTimeFrame}
          handleSelection={handleSelection}
          reset={reset}
          submit={submit}
        />
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={activeTab === ReportType.Executive ? 14 : 8} xxl={12}>
        <Row justify="space-between">
          <Col span={12}>
            <FilterActions
              activeTab={activeTab}
              reset={() => setReset(reset + 1)}
              submit={() => setSubmit(submit + 1)}
            />
          </Col>
          <Col span={12}>
            <Actions
              activeTab={activeTab}
              refresh={() => setSubmit(submit + 1)}
              isDownloadDisabled={isDownloadDisabled}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
