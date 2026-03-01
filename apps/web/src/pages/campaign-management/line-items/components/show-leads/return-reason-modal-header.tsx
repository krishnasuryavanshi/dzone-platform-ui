import { Button, Flex, Typography } from 'antd';
import { CloseCircleTwoTone } from '@ant-design/icons';
import { FC } from 'react';

const { Title } = Typography;

interface IReturnReasonsModalProps {
  onCancel: () => void;
}

export const ReturnReasonsModalHeader: FC<IReturnReasonsModalProps> = ({
  onCancel,
}) => {
  return (
    <Flex
      align='center'
      justify='space-between'
      style={{
        background: '#235AED',
        padding: '1.125rem 1.5rem',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        position: 'relative',
      }}>
      <Title
        level={5}
        style={{
          color: '#fff',
          margin: 0,
          fontWeight: 700,
          textAlign: 'center',
        }}>
        Select the reason for returning the lead.
      </Title>
      <Button
        type='text'
        onClick={onCancel}
        style={{
          color: '#fff',
          fontSize: 20,
          fontWeight: 400,
          position: 'absolute',
          right: 16,
        }}>
        <CloseCircleTwoTone />
      </Button>
    </Flex>
  );
};
