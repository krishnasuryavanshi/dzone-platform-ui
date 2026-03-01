import { Badge, Flex, Typography } from 'antd';
import { FC, useState } from 'react';
import { DrawerShowList } from '@/components/shared/text';
import { TruncatedTagList } from '../../lead-validation-settings/show-rule/components/truncated-tag-list';

const { Text } = Typography;

interface ICustomField {
  id: string;
  fieldOrder: number;
  name: string;
  type: string;
  format?: string;
  required: boolean;
  inclusion: string | null;
  exclusion: string | null;
}

interface ICustomFieldsDisplayProps {
  customFields: ICustomField[];
}

export const CustomFieldsDisplay: FC<ICustomFieldsDisplayProps> = ({
  customFields,
}) => {
  const [drawerState, setDrawerState] = useState<{
    open: boolean;
    title: string;
    list: string[];
  }>({
    open: false,
    title: '',
    list: [],
  });

  const handleViewAll = (title: string, values: string) => {
    const list = values.split(',').filter((val) => val.trim());
    setDrawerState({
      open: true,
      title,
      list,
    });
  };

  const handleCloseDrawer = () => {
    setDrawerState({
      open: false,
      title: '',
      list: [],
    });
  };

  const splitValues = (value: string | null): string[] => {
    if (!value) return [];
    return value.split(',').filter((val) => val.trim());
  };

  return (
    <>
      <Flex vertical gap='1rem'>
        {customFields.map((field) => {
          const inclusionValues = splitValues(field.inclusion);
          const exclusionValues = splitValues(field.exclusion);

          return (
            <Flex
              key={field.id}
              vertical
              gap='1rem'
              style={{
                padding: '1rem',
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
              }}>
              {/* Header with field name and required badge */}
              <Flex align='center' gap='0.5rem'>
                <Text strong style={{ fontSize: '0.875rem' }}>
                  {field.fieldOrder}. {field.name}
                </Text>
                <Badge
                  color={field.required ? '#235AED' : '#6B7280'}
                  text={field.required ? 'Mandatory' : 'Optional'}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 400,
                  }}
                />
              </Flex>

              {/* Inclusion Values */}
              {inclusionValues.length > 0 && (
                <Flex vertical gap='0.5rem'>
                  <Text strong style={{ fontSize: '0.875rem' }}>
                    Inclusion Values
                  </Text>
                  <TruncatedTagList
                    items={inclusionValues}
                    onViewAll={() =>
                      handleViewAll(
                        `${field.name} - Inclusion Values`,
                        field.inclusion || '',
                      )
                    }
                  />
                </Flex>
              )}

              {/* Exclusion Values */}
              {exclusionValues.length > 0 && (
                <Flex vertical gap='0.5rem'>
                  <Text strong style={{ fontSize: '0.875rem' }}>
                    Suppression Values
                  </Text>
                  <TruncatedTagList
                    items={exclusionValues}
                    onViewAll={() =>
                      handleViewAll(
                        `${field.name} - Suppression Values`,
                        field.exclusion || '',
                      )
                    }
                  />
                </Flex>
              )}
            </Flex>
          );
        })}
      </Flex>

      {/* Drawer for viewing all values */}
      <DrawerShowList
        label={drawerState.title}
        show={drawerState.open}
        list={drawerState.list}
        hasChildren={false}
        handleClose={handleCloseDrawer}
      />
    </>
  );
};
