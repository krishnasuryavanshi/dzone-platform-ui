import { type FC } from 'react';
import { Flex } from 'antd';
import { MapFunction } from '@dzone/shared-ui';
import { TextContent } from '../instructions/text-content';
import { ActionRenderer } from '../actions/action-renderer';

type DzRecord = Record<string, any>;

interface SystemMessageActionsProps {
  actions: DzRecord[];
  isHistory?: boolean;
}

export const SystemMessageActions: FC<SystemMessageActionsProps> = ({
  actions,
  isHistory,
}) => {
  const renderAction = (action: DzRecord, index: number) => {
    const { message, field } = action;

    if (message) {
      return <TextContent key={`msg-${index}`} data={message} />;
    }

    if (field && !isHistory) {
      return (
        <ActionRenderer key={`action-${index}`} field={field} />
      );
    }

    return null;
  };

  return (
    <Flex vertical gap="0.5rem">
      <MapFunction items={actions || []} renderItem={renderAction} />
    </Flex>
  );
};
