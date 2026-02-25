import { ConfigProvider, App as AntdApp } from 'antd';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { useThemeStore } from '@dzone/shared-store';
import { lightTheme, darkTheme } from '@dzone/shared-styles';
import { queryClient } from './query-client';
import { router } from './router';

export default function App() {
  const { mode } = useThemeStore();

  return (
    <ConfigProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
