import { type FC, useRef, useEffect } from 'react';
import { Flex } from 'antd';
import { useDzentStore } from '../../stores/use-dzent-store';
import { ChatMessagesContainer } from '../chat-messages/chat-messages-container';
import { FooterContent } from './footer-content';

export const ChatWidgetContainer: FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { conversation, systemMessage, userMessage, isWaitingForResponse } =
    useDzentStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, systemMessage, userMessage, isWaitingForResponse]);

  return (
    <Flex
      vertical
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
    >
      <Flex
        ref={scrollRef}
        vertical
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '1rem',
          minHeight: 0,
        }}
        className="show-scroll"
      >
        <ChatMessagesContainer />
      </Flex>
      <FooterContent />
    </Flex>
  );
};
