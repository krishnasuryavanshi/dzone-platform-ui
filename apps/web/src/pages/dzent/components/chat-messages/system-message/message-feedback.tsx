import { type FC, useState } from 'react';
import { Button, Flex } from 'antd';
import { LikeOutlined, DislikeOutlined, LikeFilled, DislikeFilled } from '@ant-design/icons';
import { useDzentStore } from '../../../stores/use-dzent-store';
import { submitFeedback } from '../../../services';

type DzRecord = Record<string, any>;

interface MessageFeedbackProps {
  feedback?: DzRecord | null;
  feedbackGiven?: 'up' | 'down' | null;
  isHistory?: boolean;
}

export const MessageFeedback: FC<MessageFeedbackProps> = ({
  feedback,
  feedbackGiven: initialFeedback,
  isHistory,
}) => {
  const { conversationId, setCurrentFeedbackGiven, currentFeedbackGiven } =
    useDzentStore();
  const [localFeedback, setLocalFeedback] = useState<'up' | 'down' | null>(
    initialFeedback || null,
  );

  const activeFeedback = isHistory ? localFeedback : currentFeedbackGiven;

  const handleFeedback = async (type: 'up' | 'down') => {
    if (isHistory) {
      setLocalFeedback(type);
    } else {
      setCurrentFeedbackGiven(type);
    }

    try {
      await submitFeedback({
        conversationId,
        messageId: feedback?.messageId,
        feedback: type === 'up' ? 'positive' : 'negative',
      });
    } catch {
      // silent
    }
  };

  return (
    <Flex gap="0.25rem" style={{ marginTop: '-0.5rem', marginLeft: '3.25rem' }}>
      <Button
        type="text"
        size="small"
        icon={activeFeedback === 'up' ? <LikeFilled style={{ color: '#235AED' }} /> : <LikeOutlined />}
        onClick={() => handleFeedback('up')}
      />
      <Button
        type="text"
        size="small"
        icon={activeFeedback === 'down' ? <DislikeFilled style={{ color: '#F64C4C' }} /> : <DislikeOutlined />}
        onClick={() => handleFeedback('down')}
      />
    </Flex>
  );
};
