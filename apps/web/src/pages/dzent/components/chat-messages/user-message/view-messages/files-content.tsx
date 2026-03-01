import { type FC, type ReactNode } from 'react';
import { Flex, Typography } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import { Hideable, MapFunction } from '@dzone/shared-ui';

const { Text } = Typography;

type DzRecord = Record<string, any>;

interface FilesContentProps {
  files: DzRecord[];
  children?: ReactNode;
}

export const UserFilesContent: FC<FilesContentProps> = ({ files, children }) => {
  return (
    <Hideable show={files.length > 0}>
      <Flex vertical gap="0.5rem">
        {children}
        <MapFunction
          items={files}
          renderItem={(file: DzRecord) => (
            <Flex key={file.id || file.name} gap="0.5rem" align="center">
              <FileOutlined style={{ color: '#fff' }} />
              <Text style={{ fontSize: '0.875rem', color: '#fff' }}>
                {file.name}
              </Text>
            </Flex>
          )}
        />
      </Flex>
    </Hideable>
  );
};
