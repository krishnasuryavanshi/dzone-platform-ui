import { Flex, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { FC } from 'react';

const { Text, Title } = Typography;

interface IAfterFileUploadProps {
  field: string;
  fileTypeName: string;
  extensions: string;
}

export const AfterFileUpload: FC<IAfterFileUploadProps> = ({
  field,
  fileTypeName,
  extensions,
}) => {
  return (
    <Tooltip
      color='#707070'
      overlayStyle={{ maxWidth: '30rem' }}
      title={
        <TooltipContent
          field={field}
          fileTypeName={fileTypeName}
          extensions={extensions}
        />
      }
      placement='right'>
      <Flex>
        <InfoCircleOutlined style={{ color: '#707070', fontSize: '1.5rem' }} />
      </Flex>
    </Tooltip>
  );
};

const TooltipContent: FC<IAfterFileUploadProps> = ({
  field,
  fileTypeName,
  extensions,
}) => {
  const isMultiColumnFileUpload = field.includes(',');
  return (
    <Flex vertical style={{ padding: '1rem' }}>
      <Title level={4} style={{ color: '#fff', marginBottom: '0' }}>
        Please follow these format guidelines:
      </Title>
      <Text style={{ color: '#fff' }}>
        The file must be a {fileTypeName} file with the following required
        columns in order: [{field}]
      </Text>
      <Text style={{ color: '#fff' }}>
        Ensure there are no extra columns or missing required columns, and
        double-check for typos or formatting issues before uploading.{' '}
        {isMultiColumnFileUpload
          ? 'If values for any of the required columns do not exist, include the column names and leave the values blank.'
          : null}{' '}
        Save your file with a{' '}
        <Text strong style={{ color: '#fff' }}>
          {extensions}
        </Text>{' '}
        extension to ensure compatibility.
      </Text>
    </Flex>
  );
};
