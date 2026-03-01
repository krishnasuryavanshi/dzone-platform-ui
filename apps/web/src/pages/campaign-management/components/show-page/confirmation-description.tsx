import { Row } from 'antd';

interface IConfirmationDescription {
  description?: string;
}

export const ConfirmationDescription: React.FC<IConfirmationDescription> = ({
  description,
}) => {
  return (
    <Row
      style={{
        padding: '1.25rem',
        fontSize: '1rem',
        lineHeight: '1.5',
      }}>
      {description}
    </Row>
  );
};
