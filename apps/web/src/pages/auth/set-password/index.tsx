import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Form, Input, Button, Flex, Typography, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { setPassword } from './services';

const { Title, Text } = Typography;

export default function SetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token') || '';

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      notification.error({
        message: t('form.setPassword.mismatch', 'Passwords do not match'),
      });
      return;
    }

    setLoading(true);
    try {
      await setPassword(token, values.password);
      notification.success({
        message: t('form.setPassword.success', 'Password set successfully'),
      });
      navigate('/login', { replace: true });
    } catch {
      notification.error({
        message: t('form.setPassword.error', 'Failed to set password'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit} style={{ width: '100%' }}>
      <Flex vertical>
        <Title
          level={4}
          style={{ marginBottom: '1rem', color: '#fff', fontWeight: 500, fontSize: '1.5rem' }}
        >
          {t('form.setPassword.heading', 'Set new password')}
        </Title>

        <Text style={{ marginBottom: '1.5rem', color: '#fff', fontWeight: 500 }}>
          {t('form.setPassword.message', 'Enter your new password below')}
        </Text>

        <Form.Item
          name="password"
          label={t('form.setPassword.password.label', 'New Password')}
          rules={[
            {
              required: true,
              message: t('form.setPassword.password.required', 'Please enter a password'),
            },
            {
              min: 8,
              message: t(
                'form.setPassword.password.invalid',
                'Password must be at least 8 characters',
              ),
            },
          ]}
        >
          <Input.Password
            placeholder={t('form.setPassword.password.placeholder', 'Enter new password')}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={t('form.setPassword.confirmPassword.label', 'Confirm Password')}
          rules={[
            {
              required: true,
              message: t(
                'form.setPassword.confirmPassword.required',
                'Please confirm your password',
              ),
            },
          ]}
        >
          <Input.Password
            placeholder={t(
              'form.setPassword.confirmPassword.placeholder',
              'Confirm new password',
            )}
            size="large"
          />
        </Form.Item>

        <Flex align="center" justify="center" style={{ paddingTop: '1rem' }}>
          <Button
            size="large"
            htmlType="submit"
            block
            loading={loading}
            style={{
              background: '#323131',
              border: 'none',
              borderRadius: '3.125rem',
              color: '#fff',
            }}
          >
            {t('form.setPassword.submit', 'Set Password')}
          </Button>
        </Flex>
      </Flex>
    </Form>
  );
}
