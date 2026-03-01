import { type FC, type ReactNode } from 'react';
import { Col, Row } from 'antd';
import { useFilterDropdowns, type IUseFilterDropdowns } from '../../hooks';
import { CampaignsDropdown } from './campaigns-dropdown';
import { LineItemsDropdown } from './line-items-dropdown';
import { DurationDropdown } from './duration-dropdown';

interface FilterDropdownsProps extends IUseFilterDropdowns {
  allDurations?: { key: string; label: ReactNode }[];
}

export const FilterDropdowns: FC<FilterDropdownsProps> = ({
  allCampaigns,
  allLineItems,
  allDurations,
  submit,
  reset,
  handleSelection,
  activeTab,
}) => {
  const {
    selectedLineItems,
    selectedCampaigns,
    selectedDuration,
    availableCampaigns,
    availableLineItems,
    handleSelectionChange,
  } = useFilterDropdowns({
    allCampaigns,
    allLineItems,
    submit,
    reset,
    handleSelection,
    activeTab,
  });

  return (
    <Row gutter={[12, 12]} align="bottom">
      <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
        <CampaignsDropdown
          availableCampaigns={availableCampaigns}
          handleSelectionChange={handleSelectionChange}
          selectedCampaigns={selectedCampaigns}
        />
      </Col>
      <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
        <LineItemsDropdown
          availableLineItems={availableLineItems}
          handleSelectionChange={handleSelectionChange}
          selectedLineItems={selectedLineItems}
        />
      </Col>
      <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
        <DurationDropdown
          availableDurations={allDurations}
          handleSelectionChange={handleSelectionChange}
          selectedDurations={selectedDuration}
        />
      </Col>
    </Row>
  );
};
