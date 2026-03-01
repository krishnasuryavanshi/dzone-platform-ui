import { type FC } from 'react';
import { Flex, Typography } from 'antd';
import { Hideable, MapFunction } from '@dzone/shared-ui';
import { useDzentStore } from '../../stores/use-dzent-store';
import { ChatSummarySection } from './chat-summary-section';

const { Text } = Typography;

export const ChatSummaryContainer: FC = () => {
  const { chatSummary } = useDzentStore();

  if (!chatSummary) return null;

  const campaignSections = chatSummary.campaign
    ? Object.entries(chatSummary.campaign as Record<string, any>)
    : [];
  const lineItemEntries = chatSummary.lineItems
    ? Object.entries(chatSummary.lineItems as Record<string, any>)
    : [];

  return (
    <Flex
      vertical
      gap="0.5rem"
      style={{ overflow: 'auto', flex: 1, minHeight: 0, padding: '0.25rem' }}
      className="show-scroll"
    >
      <Text strong style={{ fontSize: '0.875rem' }}>Summary</Text>

      <Hideable show={campaignSections.length > 0}>
        <Text strong style={{ fontSize: '0.8125rem', color: '#235AED' }}>
          Campaign
        </Text>
        <MapFunction
          items={campaignSections}
          renderItem={([sectionName, fields]: [string, any]) => (
            <ChatSummarySection
              key={sectionName}
              title={sectionName}
              fields={fields}
            />
          )}
        />
      </Hideable>

      <Hideable show={lineItemEntries.length > 0}>
        <MapFunction
          items={lineItemEntries}
          renderItem={([lineItemName, sections]: [string, any]) => (
            <Flex key={lineItemName} vertical gap="0.25rem">
              <Text strong style={{ fontSize: '0.8125rem', color: '#235AED' }}>
                {lineItemName}
              </Text>
              <MapFunction
                items={Object.entries(sections || {})}
                renderItem={([sectionName, fields]: [string, any]) => (
                  <ChatSummarySection
                    key={sectionName}
                    title={sectionName}
                    fields={fields}
                  />
                )}
              />
            </Flex>
          )}
        />
      </Hideable>
    </Flex>
  );
};
