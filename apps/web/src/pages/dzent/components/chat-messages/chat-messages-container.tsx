import { type FC } from 'react';
import { Flex } from 'antd';
import { MapFunction } from '@dzone/shared-ui';
import { useDzentStore } from '../../stores/use-dzent-store';
import { ConversationHistoryItem } from './conversation-history/conversation-history-item';
import { SystemMessageWrapper } from './system-message/system-message-wrapper';
import { SystemMessageActions } from './system-message/system-message-actions';
import { UserMessageView } from './user-message/user-message-view';
import { WaitingBubble } from './waiting-bubble/waiting-bubble';

type DzRecord = Record<string, any>;

export const ChatMessagesContainer: FC = () => {
  const { conversation, systemMessage, userMessage } = useDzentStore();

  return (
    <Flex vertical gap="1rem">
      {/* Historical conversation messages */}
      <MapFunction
        items={conversation}
        renderItem={(item: DzRecord, index: number) => (
          <ConversationHistoryItem key={index} item={item} />
        )}
      />

      {/* Current system message */}
      {systemMessage && (
        <SystemMessageWrapper>
          <SystemMessageActions actions={systemMessage} />
        </SystemMessageWrapper>
      )}

      {/* Current user message */}
      {userMessage && <UserMessageView message={userMessage} />}

      {/* Waiting indicator */}
      <WaitingBubble />
    </Flex>
  );
};
