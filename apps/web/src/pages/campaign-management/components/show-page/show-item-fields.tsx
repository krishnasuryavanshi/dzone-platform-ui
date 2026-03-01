import { FC, Fragment, useEffect, useState } from 'react';
import { Row, Typography, Skeleton, Space, Flex } from 'antd';
import { FieldColumn } from './field-column';

const { Text } = Typography;

export interface IShowItemFieldsProps {
  itemDetails?: Record<string, any>;
  formConfig: any;
  isCollapsed: boolean;
  summaryViewFields: string[];
}

export const ShowItemFields: FC<IShowItemFieldsProps> = ({
  itemDetails,
  isCollapsed,
  summaryViewFields,
}) => {
  // TODO: Import useShowFieldsData from line-items/lib/hooks when available in 5C
  // const { fieldsList } = useShowFieldsData(itemDetails, formConfig);
  const fieldsList: any[] = [];
  const [fieldsToDisplay, setFieldsToDisplay] = useState<any[]>([]);

  const isFieldValueNonEmpty = (value: any): boolean => {
    return (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      (!Array.isArray(value) || value.length > 0) &&
      (!(typeof value === 'object') || Object.keys(value).length > 0)
    );
  };

  useEffect(() => {
    if (isCollapsed) {
      const summaryFields = Array.isArray(fieldsList)
        ? fieldsList
            .map((group) => ({
              ...group,
              fields: group.fields.filter((fieldObj: { field: string }) =>
                summaryViewFields.includes(fieldObj.field),
              ),
            }))
            .filter((group) => group.fields.length > 0)
        : [];
      setFieldsToDisplay(summaryFields);
    } else {
      const nonEmptySections = Array.isArray(fieldsList)
        ? fieldsList
            .filter((group) =>
              group.fields.some((field: any) => isFieldValueNonEmpty(field.value)),
            )
            .map((group) => ({
              ...group,
              sectionLabel: group.section || 'Untitled Section',
              fields: group.fields.filter((field: any) => isFieldValueNonEmpty(field.value)),
            }))
        : [];
      setFieldsToDisplay(nonEmptySections);
    }
  }, [isCollapsed, fieldsList, summaryViewFields]);

  if (!itemDetails) return <Skeleton active />;

  return (
    <>
      {fieldsToDisplay.map((fieldGroup: any, groupIndex: number) => (
        <Fragment key={groupIndex}>
          {fieldGroup.sectionLabel && fieldGroup.sectionLabel !== 'Basic Details' && (
            <Text strong>{fieldGroup.sectionLabel}</Text>
          )}
          <Flex
            vertical
            style={{
              margin: '0.25rem 0 1rem 0',
              background: '#f5f5f5',
              overflow: 'hidden',
              borderRadius: '0.5rem',
            }}
          >
            {Array.isArray(fieldGroup.fields) &&
              fieldGroup.fields
                .reduce((rows: any[][], field: any, index: number) => {
                  const chunkIndex = Math.floor(index / 4);
                  if (!rows[chunkIndex]) rows[chunkIndex] = [];
                  rows[chunkIndex].push(field);
                  return rows;
                }, [])
                .map((rowFields: any[], rowIndex: number, allRows: any[]) => (
                  <Space
                    key={rowIndex}
                    direction="vertical"
                    style={{
                      width: '100%',
                      borderBottom: rowIndex !== allRows.length - 1 ? '1px solid #e5e7eb' : undefined,
                      padding: '1rem',
                    }}
                  >
                    <Row gutter={[16, 16]}>
                      {rowFields.map((field: any) => (
                        <FieldColumn key={field.field} data={field} />
                      ))}
                    </Row>
                  </Space>
                ))}
          </Flex>
        </Fragment>
      ))}
    </>
  );
};
