import { Modal, Typography, List } from 'antd';
import { useTranslation } from 'react-i18next';
import { ICustomQuestion } from '../../lib/types';

const { Text } = Typography;

export const ExpandCustomQuestions = ({
  label,
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
  return (
    <Modal
      title={t(label)}
      onCancel={handleClose}
      centered
      width="95vw"
      footer={null}
      open={show}>
      <List
        bordered
        style={{ maxHeight: '85vh', overflow: 'auto' }}
        size="small"
        itemLayout="horizontal"
        dataSource={questions}
        renderItem={(item, index) => (
          <>
            <List.Item>
              <Text strong>{index + 1}.</Text> {item.question}
            </List.Item>
            <List.Item style={{ paddingLeft: '2rem' }}>
              <Text strong>Accepted Answers:</Text> {item.acceptedAnswer}
            </List.Item>
            <List.Item style={{ paddingLeft: '2rem' }}>
              <Text strong>Rejected Answers:</Text> {item.rejectedAnswer}
            </List.Item>
          </>
        )}
      />
    </Modal>
  );
};
