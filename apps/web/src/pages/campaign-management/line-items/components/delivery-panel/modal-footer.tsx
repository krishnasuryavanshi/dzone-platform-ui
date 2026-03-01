import { Button, Flex, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CLR_BLUE_LIGHT } from '@dzone/shared-lib';

interface IModalFooterProps {
  isLoading: boolean;
  onCancel: () => void;
  handleProceed: () => void;
  filterLeadsCount: number;
}

export const ModalFooter: FC<IModalFooterProps> = ({
  isLoading,
  onCancel,
  handleProceed,
  filterLeadsCount,
}) => {
  const { t } = useTranslation();

  return (
    <Flex gap='0.5rem' align='center' justify='flex-end'>
      <Button
        size='small'
        style={{ borderColor: isLoading ? '#d4d4d4' : `${CLR_BLUE_LIGHT}` }}
        onClick={onCancel}
        disabled={isLoading}>
        Cancel
      </Button>
      <Button
        type='primary'
        style={{ width: '5rem' }}
        size='small'
        onClick={handleProceed}
        disabled={filterLeadsCount === 0}>
        {isLoading ? (
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: '1.5rem', color: '#fff' }}
                spin
              />
            }
          />
        ) : (
          t('Proceed')
        )}
      </Button>
    </Flex>
  );
};
