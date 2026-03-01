import { FC, useState } from 'react';
import { Col } from 'antd';
import { isArray } from 'lodash-es';
import { LineItemFields } from '../../line-items/lib/enums';

interface IFieldColumnProps {
  data: Record<string, any>;
  handleDownload: () => Promise<void>;
}

const rangeFields: string[] = [
  LineItemFields.IsCompanySizeEmployeeCountCustom,
  LineItemFields.IsCompanySizeRevenueCustom,
];

export const ShowFieldColumn: FC<IFieldColumnProps> = ({ data }) => {
  // TODO: Import useViewControl from shared hooks when available
  const ViewControl = null;
  const [colSpan] = useState({
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6,
    xxl: 4,
  });

  if (
    (!data?.value || (isArray(data?.value) && !data?.value?.length)) &&
    !rangeFields.includes(data.field)
  )
    return null;

  return (
    <Col {...colSpan}>
      {/* TODO: Replace with FieldPreview component when available */}
      {ViewControl || data?.value}
    </Col>
  );
};
