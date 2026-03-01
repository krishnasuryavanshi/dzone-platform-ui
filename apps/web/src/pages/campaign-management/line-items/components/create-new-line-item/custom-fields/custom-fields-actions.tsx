import { LoaderButton } from '@dzone/shared-ui';
import { Button, Flex } from 'antd';
import React from 'react';

interface ICustomFieldsActionsProps {
  loading: boolean;
  handleCancel: () => void;
}

export const CustomFieldsActions: React.FC<ICustomFieldsActionsProps> = ({
  loading,
  handleCancel,
}) => {
  return (
    <Flex
      justify='end'
      gap='0.5rem'
      style={{ marginBottom: '3rem', marginRight: '2rem' }}>
      <Button onClick={handleCancel}>Cancel</Button>
      {loading ? (
        <LoaderButton style={{ width: '9.5rem' }} />
      ) : (
        <Button htmlType='submit' type='primary'>
          Done
        </Button>
      )}
    </Flex>
  );
};
