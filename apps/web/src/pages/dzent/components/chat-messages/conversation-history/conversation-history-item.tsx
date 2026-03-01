import { type FC } from 'react';
import { SystemMessageWrapper } from '../system-message/system-message-wrapper';
import { SystemMessageActions } from '../system-message/system-message-actions';
import { UserMessageView } from '../user-message/user-message-view';
import { MessageFeedback } from '../system-message/message-feedback';

type DzRecord = Record<string, any>;

interface ConversationHistoryItemProps {
  item: DzRecord;
}

export const ConversationHistoryItem: FC<ConversationHistoryItemProps> = ({
  item,
}) => {
  if (item.type === 'system') {
    return (
      <>
        <SystemMessageWrapper>
          <SystemMessageActions actions={item.message} isHistory />
        </SystemMessageWrapper>
        {item.feedback && (
          <MessageFeedback
            feedback={item.feedback}
            feedbackGiven={item.feedbackGiven}
            isHistory
          />
        )}
      </>
    );
  }

  return <UserMessageView message={item.message} />;
};
