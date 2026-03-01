import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';

interface IUploadButtonIconProps {
  isLoading: boolean;
  label?: string;
}

export const UploadButtonIcon: FC<IUploadButtonIconProps> = ({
  isLoading,
  label = 'upload',
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingOutlined style={{ marginLeft: '0.5rem' }} />;
  }

  return (
    <>
      {t(label)}
      <UploadOutlined style={{ marginLeft: '0.5rem' }} />
    </>
  );
};
