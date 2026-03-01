import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Flex, Typography, Spin, Progress } from 'antd';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';

const { Text } = Typography;

interface IUploadProgressProps {
  progress: number;
  show: boolean;
}

export const UploadProgress: FC<IUploadProgressProps> = ({
  progress,
  show,
}) => {
  const { t } = useTranslation();

  if (!show) return null;
  return (
    <Flex align="flex-start" gap="1rem" style={{ width: "100%" }}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
      <Flex vertical gap={"0.5rem"} style={{ flex: 1 }}>
        <Flex justify="space-between" align="center">
          <Text strong>
            {t('fileUpload.labels.uploading')}
          </Text>
          <CloseOutlined color="#000" />
        </Flex>
        <Progress
          percent={progress}
          status="active"
          showInfo={false}
          trailColor="#fff"
        />
      </Flex>
    </Flex>
  );
};
