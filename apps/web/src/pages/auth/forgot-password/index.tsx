import { useState } from 'react';
import { Form, Input, Button, Flex, Typography, App } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { resetPassword } from './services';

const { Text, Title } = Typography;

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { notification } = App.useApp();
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { email?: string }) => {
    const email = values.email && !isLinkSent ? values.email : verifiedEmail;
    setLoading(true);
    try {
      const data = await resetPassword(email);
      if (data) {
        setIsLinkSent(true);
        if (!isLinkSent && values.email) {
          setVerifiedEmail(values.email);
        }
        notification.success({
          message: t('form.forgotPassword.otpSent', 'OTP sent successfully'),
        });
      } else {
        notification.error({
          message: t('form.forgotPassword.userNotFound', 'User not found'),
        });
      }
    } catch {
      notification.error({
        message: t('form.forgotPassword.userNotFound', 'User not found'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit} style={{ width: '100%' }}>
      <Flex vertical>
        {isLinkSent && (
          <img
            src="/images/email-link-sent.svg"
            alt=""
            style={{ marginBottom: '2rem', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          />
        )}

        <Title
          level={4}
          style={{ margin: '0 0 1rem 0', color: '#fff', fontWeight: 500, fontSize: '1.5rem', textAlign: 'center' }}
        >
          {isLinkSent
            ? t('form.forgotPassword.headingCheckYourEmailInbox', 'Check your email inbox')
            : t('form.forgotPassword.headingResetPassword', 'Reset password')}
        </Title>

        <Text
          style={{
            marginBottom: isLinkSent ? 0 : '1.5rem',
            color: '#fff',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          {isLinkSent
            ? t('form.forgotPassword.messageLinkReceived', {
                email: verifiedEmail,
                defaultValue: `We sent a link to ${verifiedEmail}`,
              })
            : t(
                'form.forgotPassword.messageResetPassword',
                'Enter your email to receive a reset link',
              )}
        </Text>

        {!isLinkSent && (
          <Form.Item
            name="email"
            label={t('form.forgotPassword.email.label', 'Email')}
            rules={[
              {
                required: true,
                type: 'email',
                message: t(
                  'form.forgotPassword.email.required',
                  'Please enter a valid email',
                ),
              },
            ]}
          >
            <Input
              placeholder={t('form.forgotPassword.email.placeholder', 'Enter your email')}
            />
          </Form.Item>
        )}

        <Flex align="center" justify="center" style={{ width: '100%', marginTop: '1.5rem' }}>
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
            {isLinkSent
              ? t('form.forgotPassword.resend', 'Resend link')
              : t('form.forgotPassword.next', 'Send reset link')}
          </Button>
        </Flex>

        <Flex justify="center" style={{ marginTop: '1.5rem' }}>
          <Link to="/login" style={{ color: '#fff' }}>
            {t('form.forgotPassword.backToLogin', 'Back to login')}
          </Link>
        </Flex>
      </Flex>
    </Form>
  );
}
