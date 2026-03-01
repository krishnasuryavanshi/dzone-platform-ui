import { type FC } from 'react';
import { Flex, Typography } from 'antd';
import { Hideable, MapFunction } from '@dzone/shared-ui';

const { Text } = Typography;

interface ChatSummarySectionProps {
  title: string;
  fields: Array<{ name: string; value: string | number | null }>;
}

export const ChatSummarySection: FC<ChatSummarySectionProps> = ({
  title,
  fields,
}) => {
  return (
    <Flex vertical gap="0.125rem" style={{ marginLeft: '0.5rem', marginBottom: '0.5rem' }}>
      <Text style={{ fontSize: '0.75rem', fontWeight: 600 }}>{title}</Text>
      <Hideable show={!!fields?.length}>
        <MapFunction
          items={fields || []}
          renderItem={(field: { name: string; value: string | number | null }, index: number) => (
            <Flex key={index} gap="0.25rem" style={{ marginLeft: '0.5rem' }}>
              <Text style={{ fontSize: '0.75rem', color: '#666' }}>{field.name}:</Text>
              <Text style={{ fontSize: '0.75rem' }}>{field.value ?? '-'}</Text>
            </Flex>
          )}
        />
      </Hideable>
    </Flex>
  );
};
