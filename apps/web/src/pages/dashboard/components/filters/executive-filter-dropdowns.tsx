import { type FC, type ReactNode } from 'react';
import { Col, Row } from 'antd';
import { useFilterDropdowns, type IUseFilterDropdowns } from '../../hooks';
import { UnitsDropdown } from './units-dropdown';
import { ComparisonDropdown } from './comparison-dropdown';

interface ExecutiveFilterDropdownsProps extends IUseFilterDropdowns {
  allUnits?: { key: string; label: ReactNode }[];
  allTimeFrame?: { key: string; label: ReactNode }[];
}

export const ExecutiveFilterDropdowns: FC<ExecutiveFilterDropdownsProps> = ({
  submit,
  reset,
  allUnits,
  allTimeFrame,
  handleSelection,
  activeTab,
}) => {
  const { selectedUnit, selectedTimeFrame, handleSelectionChange } = useFilterDropdowns({
    submit,
    reset,
    handleSelection,
    activeTab,
  });

  return (
    <Row gutter={[12, 12]} align="bottom">
      <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10}>
        <UnitsDropdown
          allUnits={allUnits}
          selectedUnit={selectedUnit}
          handleSelectionChange={handleSelectionChange}
        />
      </Col>
      <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14}>
        <ComparisonDropdown
          allTimeFrame={allTimeFrame}
          selectedTimeFrame={selectedTimeFrame}
          handleSelectionChange={handleSelectionChange}
        />
      </Col>
    </Row>
  );
};
