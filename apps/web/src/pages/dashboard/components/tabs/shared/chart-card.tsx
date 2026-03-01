import { type FC, type PropsWithChildren, type ReactNode } from 'react';
import { Card, Flex } from 'antd';
import { useTranslation } from 'react-i18next';

interface ChartCardProps extends PropsWithChildren {
  title: string;
  extra?: ReactNode;
}

export const ChartCard: FC<ChartCardProps> = ({ title, extra, children }) => {
  const { t } = useTranslation();
  return (
    <Card
      title={t(title)}
      extra={extra}
      style={{ boxShadow: '4px 4px 10px 0px rgba(0, 0, 0, 0.06)' }}
      styles={{ header: { minHeight: '3rem', padding: '0 1rem' } }}>
      <Flex align="center" justify="center">
        <div style={{ height: '16.5rem', width: '100%' }}>{children}</div>
      </Flex>
    </Card>
  );
};
