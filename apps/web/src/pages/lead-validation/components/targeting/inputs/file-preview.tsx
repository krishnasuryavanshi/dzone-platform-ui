import { type FC } from 'react';
import { Button, Flex, Typography } from 'antd';
import { CloseOutlined, DeleteOutlined, DownloadOutlined, FileOutlined } from '@ant-design/icons';
import { Hideable } from '@dzone/shared-ui';
import { convertFromBytes } from '@dzone/shared-lib';
import { fileDownload } from '../../../services';

const { Text } = Typography;

interface Props {
  file: Record<string, any>;
  handleRemoveFile?: (file: Record<string, any>) => void;
}

export const FilePreview: FC<Props> = ({ file, handleRemoveFile }) => {
  const handleDownloadFile = async () => {
    await fileDownload(file.id);
  };

  return (
    <div
      style={{
        borderRadius: '5px',
        border: '1px solid rgba(35, 90, 237, 0.16)',
        padding: '1rem',
        width: '100%',
      }}>
      <Flex justify="space-between" gap="1rem" align="center" style={{ width: '100%' }}>
        <Flex gap="0.5rem" align="center">
          <div
            style={{
              borderRadius: '5px',
              border: '1px solid rgba(35, 90, 237, 0.16)',
              padding: '0.5rem',
            }}>
            <FileOutlined style={{ fontSize: '2rem' }} />
          </div>
          <div style={{ flex: 1 }}>
            <Hideable show={file.variant !== 'error'}>
              <Flex vertical gap="0.25rem">
                <Text strong ellipsis title={file.name}>
                  {file.name}
                </Text>
                <Text type="secondary">
                  {typeof file.size === 'number' ? convertFromBytes(file.size) : file.size}
                </Text>
              </Flex>
            </Hideable>
            <Hideable show={file.variant === 'error'}>
              <Text type="danger">{file.error || 'Upload unsuccessful'}</Text>
            </Hideable>
          </div>
        </Flex>
        <Flex gap="0.5rem">
          <Hideable show={file.variant !== 'error'}>
            <Button
              style={{ border: '1px solid #DDD', background: '#FFF' }}
              icon={<DownloadOutlined />}
              onClick={handleDownloadFile}
            />
            {handleRemoveFile && (
              <Button
                style={{ border: '1px solid #DDD', background: '#FFF' }}
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveFile(file)}
                danger
              />
            )}
          </Hideable>
          <Hideable show={file.variant === 'error'}>
            {handleRemoveFile && (
              <Button
                style={{ border: '1px solid #DDD', background: '#FFF' }}
                icon={<CloseOutlined />}
                onClick={() => handleRemoveFile(file)}
              />
            )}
          </Hideable>
        </Flex>
      </Flex>
    </div>
  );
};
