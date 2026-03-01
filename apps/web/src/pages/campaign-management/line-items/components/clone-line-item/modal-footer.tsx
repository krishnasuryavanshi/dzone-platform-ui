import { Button, Flex, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { FC, SyntheticEvent } from 'react';

interface IModalFooterProps {
  loadingClone: boolean;
  loadingCloneEdit: boolean;
  handleCancel: (e: SyntheticEvent) => void;
  handleSubmit: (
    e: SyntheticEvent<Element, Event>,
    isEditing: boolean,
  ) => Promise<void>;
}

export const ModalFooter: FC<IModalFooterProps> = ({
  loadingClone,
  loadingCloneEdit,
  handleCancel,
  handleSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <Flex
      className='form-footer'
      justify='end'
      align='center'
      gap={'1rem'}
      style={{ marginTop: '1rem' }}>
      <Button onClick={handleCancel} className='action cancel'>
        {t('form.actions.cancel')}
      </Button>
      <Button
        onClick={(e) => handleSubmit(e, false)}
        type='primary'
        htmlType='submit'
        className='action submit'
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {loadingClone ? (
          <Spin
            indicator={
              <LoadingOutlined style={{ fontSize: 24, color: '#fff' }} spin />
            }
            style={{ width: '2.5rem' }}
          />
        ) : (
          t('form.actions.clone')
        )}
      </Button>
      <Button
        onClick={(e) => handleSubmit(e, true)}
        type='primary'
        htmlType='submit'
        className='action submit'
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {loadingCloneEdit ? (
          <Spin
            indicator={
              <LoadingOutlined style={{ fontSize: 24, color: '#fff' }} spin />
            }
            style={{ width: '5.375rem' }}
          />
        ) : (
          t('form.actions.cloneAndEdit')
        )}
      </Button>
    </Flex>
  );
};
