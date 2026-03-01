import { Row } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface IConfirmationHeaderProps {
  title?: string;
  archiveLeads?: boolean;
}

export const ConfirmationHeader: React.FC<IConfirmationHeaderProps> = ({
  title,
}) => {
  const { t } = useTranslation();
  return (
    <Row
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1.25rem',
        borderRadius: '0.75rem',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 2px 6px 0px',
      }}>
      <ExclamationCircleOutlined
        style={{
          fontSize: '1.5rem',
          color: '#faad14',
          marginRight: '0.75rem',
        }}
      />
      <p style={{ fontWeight: 600, fontSize: '1.125rem', margin: 0 }}>
        {t(title!)}
      </p>
    </Row>
  );
};
