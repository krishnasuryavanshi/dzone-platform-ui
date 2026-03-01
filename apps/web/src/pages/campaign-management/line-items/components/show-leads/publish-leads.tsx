import { Button, Flex, notification } from 'antd';
import React, { FC } from 'react';
import { publishLeads } from '../../services';

interface IPublishLeadsProps {
  lineItemId: string;
  onSuccess: () => void;
  selectedLeads?: number[];
}

export const PublishLeads: FC<IPublishLeadsProps> = ({
  lineItemId,
  onSuccess,
  selectedLeads = [],
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handlePublishLeads = async () => {
    setIsLoading(true);
    try {
      const payload = {
        lineItemId,
        leadIds: selectedLeads,
      };
      const data = await publishLeads(payload);
      if (data?.message) {
        notification.success({
          message: data.message,
        });
      }
      onSuccess();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex>
      <Button
        className='dz-btn-action-1'
        style={{
          height: '2rem',
        }}
        onClick={handlePublishLeads}
        disabled={isLoading}
        loading={isLoading}>
        {isLoading ? 'Publishing' : 'Publish'}
      </Button>
    </Flex>
  );
};
