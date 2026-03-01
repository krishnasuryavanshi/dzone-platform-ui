import { type FC, type CSSProperties } from 'react';
import { Flex } from 'antd';
import { useDzentStore } from '../stores/use-dzent-store';
import { ChatHistoryContainer } from './chat-history/chat-history-container';
import { ChatSummaryContainer } from './chat-summary/chat-summary-container';

const CommonStyles: CSSProperties = {
  height: 'calc(100vh - 5rem)',
  position: 'relative',
  backgroundColor: '#fff',
  borderRadius: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  padding: '0.75rem',
};

export const DzentSidebar: FC = () => {
  const { chatSummary } = useDzentStore();

  if (!chatSummary || (!chatSummary.campaign && !chatSummary.lineItems)) {
    return (
      <Flex vertical style={CommonStyles}>
        <ChatHistoryContainer fullHeight />
      </Flex>
    );
  }

  return (
    <Flex vertical style={CommonStyles}>
      <Flex
        vertical
        style={{ flex: 1, minHeight: 0 }}
      >
        <ChatSummaryContainer />
      </Flex>
      <Flex
        vertical
        style={{ flex: 1, minHeight: 0, backgroundColor: '#f5f5f5' }}
      >
        <ChatHistoryContainer />
      </Flex>
    </Flex>
  );
};
