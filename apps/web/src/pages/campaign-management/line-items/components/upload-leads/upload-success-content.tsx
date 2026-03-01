import { transformPath } from '@dzone/shared-lib';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { useLineItemStore } from '../../stores';

interface IUploadSuccessContentProps {
  show: boolean;
  info?: Record<string, string | number | boolean>;
  onClickViewLeads?: (data: Record<string, string | number | boolean>) => void;
}

const Path = '/campaign-management/leads?batchId={batchId}';

export const UploadSuccessContent: FC<IUploadSuccessContentProps> = ({
  show,
  info,
  onClickViewLeads,
}) => {
  const { t } = useTranslation();
  const { value } = useLineItemStore();

  if (!show) {
    return null;
  }

  const path = transformPath(Path, {
    batchId: info?.batchId,
    ...value,
  });

  const handlClickOnViewLeads = () => {
    onClickViewLeads &&
      onClickViewLeads({
        isDialogOpen: false,
        dialogType: 'Progress',
        message: '',
      });
  };

  return (
    <Button
      type='link'
      style={{
        color: '#04CA56',
        border: '1px solid #04CA56',
        padding: '0.5rem 1rem',
        height: '2.625rem',
      }}
      href={path}
      onClick={handlClickOnViewLeads}>
      {t('Click to view the leads')}
    </Button>
  );
};
