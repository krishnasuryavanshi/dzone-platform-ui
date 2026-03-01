import { type FC } from 'react';
import { Col, Row } from 'antd';
import { TargetingInclusion } from './inputs/targeting-inclusion';
import { TargetingSwitch } from './inputs/targeting-switch';

interface Props {
  attribute: Record<string, any>;
  sectionName: string;
}

const SWITCH_TYPES = [
  'switch_suppression_inclusion',
  'switch_chips_inclusion',
  'switch_chips',
  'switch_dropdown_custom',
  'switch_dropdown_searchable',
];

export const SectionAttribute: FC<Props> = ({ sectionName, attribute }) => {
  const renderInput = () => {
    if (attribute.type === 'inclusion') {
      return <TargetingInclusion sectionName={sectionName} attribute={attribute} />;
    }
    if (attribute.type === 'job_title') {
      // TODO: Port JobTitle component when available
      return null;
    }
    if (SWITCH_TYPES.includes(attribute.type)) {
      return <TargetingSwitch sectionName={sectionName} attribute={attribute} />;
    }
    return null;
  };

  return (
    <Row>
      <Col xs={24} sm={24} md={24} xl={24} xxl={16}>
        <div
          style={{
            border: '1px solid #E5EBF1',
            borderRadius: '0.25rem',
          }}>
          {renderInput()}
        </div>
      </Col>
    </Row>
  );
};
