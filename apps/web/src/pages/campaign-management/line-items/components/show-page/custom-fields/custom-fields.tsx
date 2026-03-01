import { Hideable } from '@dzone/shared-ui';
import { Flex, Typography } from 'antd';
import { FC, useState } from 'react';
import { ICustomField } from '../../../lib/types';
import { CustomFieldCard } from './custom-field-card';
import { DrawerShowList } from '../../../../components/show-page/drawer-show-list';

const { Text, Paragraph } = Typography;

interface ICustomFieldsDisplayProps {
  customFields: ICustomField[];
  customFieldInstructions?: string;
}

export const CustomFieldsDisplay: FC<ICustomFieldsDisplayProps> = ({
  customFields,
  customFieldInstructions,
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
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(false);

  const handleViewAll = (title: string, values: string) => {
    const list = values.split(',').filter((val) => val.trim());
    setDrawerState({ open: true, title, list });
  };

  const handleCloseDrawer = () => {
    setDrawerState({ open: false, title: '', list: [] });
  };

  return (
    <>
      <Flex style={{ marginBottom: '0.5rem' }}>
        <Text strong>Custom Fields</Text>
      </Flex>
      <Flex
        vertical
        style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          paddingBottom: '1rem',
        }}>
        <Hideable show={customFields && customFields.length > 0}>
          {customFields.map((field) => (
            <CustomFieldCard
              key={field.id}
              field={field}
              onViewAllInclusion={() =>
                handleViewAll(
                  `${field.name} - Inclusion Values`,
                  field.inclusion || '',
                )
              }
              onViewAllExclusion={() =>
                handleViewAll(
                  `${field.name} - Suppression Values`,
                  field.exclusion || '',
                )
              }
            />
          ))}
        </Hideable>
        <Hideable show={!!customFieldInstructions}>
          <Flex
            vertical
            gap='0.5rem'
            style={{ padding: '1rem 0.75rem', paddingBottom: '0' }}>
            <Text strong style={{ fontSize: '0.875rem' }}>
              Custom Field Instructions
            </Text>
            <Hideable show={!isInstructionsExpanded}>
              <Paragraph
                ellipsis={{
                  rows: 2,
                  expandable: true,
                  symbol: 'view more',
                  onExpand: () => setIsInstructionsExpanded(true),
                }}
                style={{ marginBottom: 0 }}>
                {customFieldInstructions}
              </Paragraph>
            </Hideable>
            <Hideable show={isInstructionsExpanded}>
              <Paragraph style={{ marginBottom: 0 }}>
                {customFieldInstructions}
                <Text
                  style={{
                    color: '#235aed',
                    cursor: 'pointer',
                    marginLeft: '0.25rem',
                  }}
                  onClick={() => setIsInstructionsExpanded(false)}>
                  view less
                </Text>
              </Paragraph>
            </Hideable>
          </Flex>
        </Hideable>
      </Flex>

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
