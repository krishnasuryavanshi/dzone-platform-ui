import { Drawer, Button, Typography, List } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ICustomQuestion } from '../../lib/types';

const { Title, Text } = Typography;

export const ShowCustomQuestionsDrawer = ({
  label: _label,
  show,
  questions,
  handleClose,
}: {
  label: string;
  show: boolean;
  questions: ICustomQuestion[];
  handleClose: () => void;
}) => {
  const { t } = useTranslation();

  if (!show) return null;
  const commonTextCss: React.CSSProperties = {
    overflowWrap: 'break-word',
    padding: '0.5rem 0.5rem 0.5rem 2rem',
    border: '2px solid #f0f0f0',
  };
  return (
    <Drawer
      title={t('Custom Questions')}
      closeIcon={null}
      onClose={handleClose}
      placement='right'
      width='50vw'
      footer={null}
      open={show}>
      <Button
        icon={<CloseOutlined />}
        onClick={handleClose}
        className='custom-drawer-close-button'
      />
      <List
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
        size='small'
        itemLayout='vertical'
        dataSource={questions}
        renderItem={(item, index) => (
          <List.Item
            style={{
              padding: '0.5rem',
            }}>
            <Title
              level={5}
              style={{
                ...commonTextCss,
                marginBottom: '0.2rem',
                padding: '0.5rem',
                fontSize: '16px',
                background: '#f0f0f0',
              }}>
              {index + 1}. {item.question}
            </Title>
            <div
              style={{
                ...commonTextCss,
                marginBottom: '0.2rem',
              }}>
              <Text strong>Accepted Answers:</Text> {item.acceptedAnswer}
            </div>
            <div style={commonTextCss}>
              <Text strong>Rejected Answers:</Text> {item.rejectedAnswer}
            </div>
          </List.Item>
        )}
      />
    </Drawer>
  );
};
