import { Button, Flex } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ITemplateInfo } from '../../lib/types/template';

interface IDeliveryTransformAndExportButtonProps {
  openModal: () => void;
  selectedTemplate: ITemplateInfo | null;
}

export const DeliveryTransformAndExportButton: FC<
  IDeliveryTransformAndExportButtonProps
> = ({ openModal, selectedTemplate }) => {
  const { t } = useTranslation();

  return (
    <Button
      type='primary'
      className='dz-btn-action-1'
      onClick={openModal}
      disabled={!selectedTemplate}>
      <Flex gap='0.2rem'>
        {t('pages.transformAndExport')}
      </Flex>
    </Button>
  );
};
