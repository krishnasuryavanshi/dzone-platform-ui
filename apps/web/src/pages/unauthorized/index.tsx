import { Result, Button } from 'antd';
import { useNavigate } from 'react-router';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" onClick={() => navigate('/dashboard', { replace: true })}>
          Back to Dashboard
        </Button>
      }
    />
  );
}
