import { Layout, Flex, theme } from 'antd';
import { UserProfile } from './user-profile';

const { Header } = Layout;

export const AppHeader = () => {
  const {
    token: { borderRadius },
  } = theme.useToken();

  return (
    <Header
      style={{
        padding: '0 1rem 0 0.5rem',
        borderRadius,
        boxShadow: '4px 4px 10px 0 rgba(0, 0, 0, 0.06)',
      }}
    >
      <Flex justify="flex-end" align="center" style={{ height: '100%' }}>
        <UserProfile />
      </Flex>
    </Header>
  );
};
