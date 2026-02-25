import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Form, Input, Button, Checkbox, Flex, Typography, App } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { login } from '@dzone/shared-auth';
import { encrypt, decrypt, StorageKey } from '@dzone/shared-lib';
import { useTranslation } from 'react-i18next';

const { Text, Link } = Typography;

const TENANT = 'dzone';

interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const returnTo = searchParams.get('to') || '/';

  // Restore remembered credentials on mount
  useEffect(() => {
    const load = async () => {
      try {
        const rememberRaw = localStorage.getItem(`${TENANT}-${StorageKey.RememberMe}`);
        const isRemembered = rememberRaw ? JSON.parse(rememberRaw) === true : false;

        if (!isRemembered) {
          setReady(true);
          return;
        }

        const identityRaw = localStorage.getItem(`${TENANT}-${StorageKey.UserIdentity}`);
        if (identityRaw) {
          const identity = JSON.parse(identityRaw);
          const decryptedPassword = await decrypt(identity.password);
          form.setFieldsValue({
            email: identity.email,
            password: decryptedPassword,
            remember: true,
          });
          setStep('password');
        }
      } catch {
        // If decryption fails, clear stored credentials
        localStorage.removeItem(`${TENANT}-${StorageKey.RememberMe}`);
        localStorage.removeItem(`${TENANT}-${StorageKey.UserIdentity}`);
      }
      setReady(true);
    };
    load();
  }, [form]);

  const handleNext = async () => {
    try {
      await form.validateFields(['email']);
      setStep('password');
    } catch {
      // validation failed
    }
  };

  const handleBack = () => {
    setStep('email');
    form.setFieldsValue({ password: '' });
  };

  const handleSubmit = async (values: LoginValues) => {
    setLoading(true);
    try {
      await login({ email: values.email, password: values.password, remember: values.remember });

      // Store or clear remembered credentials
      const rememberKey = `${TENANT}-${StorageKey.RememberMe}`;
      const identityKey = `${TENANT}-${StorageKey.UserIdentity}`;

      if (values.remember) {
        localStorage.setItem(rememberKey, JSON.stringify(true));
        const encryptedPassword = await encrypt(values.password);
        localStorage.setItem(
          identityKey,
          JSON.stringify({ email: values.email, password: encryptedPassword }),
        );
      } else {
        localStorage.removeItem(rememberKey);
        localStorage.removeItem(identityKey);
      }

      navigate(decodeURIComponent(returnTo), { replace: true });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string }; status?: number } };
      const status = axiosErr?.response?.status;
      const backendMsg = axiosErr?.response?.data?.message;

      let description: string;
      if (status === 401 || status === 403) {
        description = backendMsg || t('form.login.invalidCredentials', 'Invalid credentials or insufficient permissions.');
      } else {
        description = backendMsg || (err instanceof Error ? err.message : 'An unexpected error occurred.');
      }

      notification.error({
        message: t('form.login.error', 'Login failed'),
        description,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!ready) return null;

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ textAlign: 'left', width: '100%' }}
    >
      {step === 'password' && (
        <Flex style={{ marginBottom: '1.25rem' }}>
          <Link onClick={handleBack} style={{ color: '#fff' }}>
            <LeftOutlined style={{ color: '#fff' }} />
            <Text style={{ color: '#fff', marginLeft: '1rem' }}>
              {t('form.login.notYou', 'Not you?')}
            </Text>
          </Link>
        </Flex>
      )}

      <Form.Item
        name="email"
        label={t('form.login.email.label', 'Email')}
        rules={[
          {
            required: true,
            type: 'email',
            message: t('form.login.email.required', 'Please enter a valid email'),
          },
        ]}
      >
        <Input
          placeholder={t('form.login.email.placeholder', 'Enter your email')}
          disabled={step === 'password'}
        />
      </Form.Item>

      {step === 'password' && (
        <>
          <Form.Item
            name="password"
            label={t('form.login.password.label', 'Password')}
            rules={[
              {
                required: true,
                message: t('form.login.password.required', 'Please enter your password'),
              },
              {
                min: 8,
                message: t('form.login.password.invalid', 'Password must be at least 8 characters'),
              },
            ]}
          >
            <Input.Password
              placeholder={t('form.login.password.placeholder', 'Enter your password')}
            />
          </Form.Item>

          <Flex align="center" justify="space-between">
            <Form.Item name="remember" valuePropName="checked" noStyle initialValue={false}>
              <Checkbox style={{ color: '#fff' }}>
                {t('form.login.rememberMe', 'Remember me')}
              </Checkbox>
            </Form.Item>
            <Link href="/forgot-password" style={{ color: '#fff', fontSize: '0.875rem' }}>
              {t('form.login.forgotPassword', 'Forgot password?')}
            </Link>
          </Flex>
        </>
      )}

      <Flex align="center" justify="center" style={{ paddingTop: '3rem' }}>
        {step === 'email' ? (
          <Button
            size="large"
            block
            onClick={handleNext}
            style={{
              background: '#323131',
              border: 'none',
              borderRadius: '3.125rem',
              color: '#fff',
            }}
          >
            {t('form.login.next', 'Next')}
          </Button>
        ) : (
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
            {t('form.login.signIn', 'Sign In')}
          </Button>
        )}
      </Flex>
    </Form>
  );
}
