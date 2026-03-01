import { type FC, type ReactNode } from 'react';
import { Flex, Typography } from 'antd';
import { Hideable, MapFunction } from '@dzone/shared-ui';

const { Text } = Typography;

type DzRecord = Record<string, any>;

interface CustomFieldsContentProps {
  data: {
    customFields: DzRecord[];
    customFieldInstructions: string;
  };
  children?: ReactNode;
}

export const UserCustomFieldsContent: FC<CustomFieldsContentProps> = ({
  data,
  children,
}) => {
  const { customFields, customFieldInstructions } = data;

  return (
    <Flex vertical gap="0.5rem">
      {children}
      <Hideable show={customFields?.length > 0}>
        <MapFunction
          items={customFields}
          renderItem={(field: DzRecord, index: number) => {
            const srNo = field.position || index + 1;
            const typeDisplay = field.format
              ? `${field.type} (${field.format})`
              : field.type;

            return (
              <Flex key={index} vertical gap="0.25rem" style={{ marginLeft: '0.5rem' }}>
                <Text strong style={{ fontSize: '0.875rem', color: '#fff' }}>
                  {srNo}) {field.label || 'Untitled Field'}
                </Text>
                <Flex style={{ marginLeft: '1rem' }}>
                  <Text style={{ fontSize: '0.875rem', color: '#fff' }}>
                    <strong>Type: </strong>{typeDisplay}
                  </Text>
                </Flex>
                <Hideable show={!!field.required}>
                  <Flex style={{ marginLeft: '1rem' }}>
                    <Text style={{ fontSize: '0.875rem', color: '#fff' }}>
                      <strong>Required: </strong>Yes
                    </Text>
                  </Flex>
                </Hideable>
                <Hideable show={!!field.inclusion}>
                  <Flex style={{ marginLeft: '1rem' }}>
                    <Text style={{ fontSize: '0.875rem', color: '#fff' }}>
                      <strong>Inclusion: </strong>{field.inclusion}
                    </Text>
                  </Flex>
                </Hideable>
                <Hideable show={!!field.exclusion}>
                  <Flex style={{ marginLeft: '1rem' }}>
                    <Text style={{ fontSize: '0.875rem', color: '#fff' }}>
                      <strong>Suppression: </strong>{field.exclusion}
                    </Text>
                  </Flex>
                </Hideable>
              </Flex>
            );
          }}
        />
      </Hideable>
      <Hideable show={!!customFieldInstructions}>
        <Flex style={{ marginTop: '0.5rem' }}>
          <Text style={{ fontSize: '0.875rem', color: '#fff' }}>
            <strong>Instructions: </strong>{customFieldInstructions}
          </Text>
        </Flex>
      </Hideable>
    </Flex>
  );
};
