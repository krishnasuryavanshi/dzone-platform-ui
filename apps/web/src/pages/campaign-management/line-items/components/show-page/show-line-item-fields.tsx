import { Row, Typography, Space, Flex, Skeleton } from 'antd';
import { Hideable } from '@dzone/shared-ui';
import { usePermissionCheck } from '@dzone/shared-auth';
import { DZONE_CLR_GRAY_4, LineItemActionsEnum } from '@dzone/shared-lib';
import { ICustomField, ILineItem } from '../../lib/types';
import { useShowFieldsData } from '../../lib/hooks/use-show-fields-data';
import { FieldColumn } from './field-column';
import { FC, Fragment, useEffect, useState } from 'react';
import { CustomFieldsDisplay } from './custom-fields';

const { Text } = Typography;

export interface IShowLineItemFieldsProps {
  itemDetails?: ILineItem;
  formConfig: any;
  isCollapsed: boolean;
  summaryViewFields: string[];
}

export const ShowLineItemFields: FC<IShowLineItemFieldsProps> = ({
  itemDetails,
  isCollapsed,
  formConfig,
  summaryViewFields,
}) => {
  const { fieldsList } = useShowFieldsData(
    itemDetails! as ILineItem,
    formConfig,
  );
  const [fieldsToDisplay, setFieldsToDisplay] = useState<any[]>([]);
  const hasViewCustomFieldsPermission = usePermissionCheck(LineItemActionsEnum.ViewCustomFields);

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
              group.fields.some(
                (field: any) =>
                  field.value !== undefined &&
                  field.value !== null &&
                  field.value !== '' &&
                  (!Array.isArray(field.value) || field.value.length > 0) &&
                  (!(typeof field.value === 'object') ||
                    Object.keys(field.value).length > 0),
              ),
            )
            .map((group) => ({
              ...group,
              sectionLabel: group.section || 'Untitled Section',
              fields: group.fields.filter(
                (field: any) =>
                  field.value !== undefined &&
                  field.value !== null &&
                  field.value !== '' &&
                  (!Array.isArray(field.value) || field.value.length > 0) &&
                  (!(typeof field.value === 'object') ||
                    Object.keys(field.value).length > 0),
              ),
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
          {fieldGroup.sectionLabel &&
            fieldGroup.sectionLabel !== 'Basic Details' && (
              <Text strong>{fieldGroup.sectionLabel}</Text>
            )}
          <Flex
            vertical
            style={{
              margin: '0.25rem 0 1rem 0',
              background: DZONE_CLR_GRAY_4,
              overflow: 'hidden',
              borderRadius: '0.5rem',
            }}>
            {Array.isArray(fieldGroup.fields) &&
              fieldGroup.fields
                .reduce((rows: any[][], field: any, index: number) => {
                  const chunkIndex = Math.floor(index / 6);
                  if (!rows[chunkIndex]) rows[chunkIndex] = [];
                  rows[chunkIndex].push(field);
                  return rows;
                }, [])
                .map(
                  (
                    rowFields: any[],
                    rowIndex: number,
                    allRows: string | any[],
                  ) => (
                    <Space
                      key={rowIndex}
                      direction='vertical'
                      style={{
                        width: '100%',
                        borderBottom:
                          allRows.length > 1 && rowIndex !== allRows.length - 1
                            ? '1px solid #e5e7eb'
                            : undefined,
                        padding: '1rem',
                      }}>
                      <Row gutter={[16, 16]}>
                        {rowFields.map((field) => {
                          return <FieldColumn key={field.field} data={field} />;
                        })}
                      </Row>
                    </Space>
                  ),
                )}
          </Flex>
        </Fragment>
      ))}
      <Hideable
        show={
          (!!itemDetails?.customFields?.length ||
            !!itemDetails?.customFieldInstructions) &&
          !isCollapsed
        }>
        <Hideable show={hasViewCustomFieldsPermission}>
          <CustomFieldsDisplay
            customFields={(itemDetails.customFields as ICustomField[]) || []}
            customFieldInstructions={itemDetails.customFieldInstructions}
          />
        </Hideable>
      </Hideable>
    </>
  );
};
