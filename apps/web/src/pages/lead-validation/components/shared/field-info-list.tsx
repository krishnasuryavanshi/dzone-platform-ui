import { type FC, type ReactNode } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const OrderedList: FC<{ children: ReactNode }> = ({ children }) => (
  <ol style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>{children}</ol>
);

const UnOrderedList: FC<{ children: ReactNode }> = ({ children }) => (
  <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>{children}</ul>
);

export const FieldInfoList: FC<{ config: Record<string, any> }> = ({ config }) => {
  const List = config.type === 'ordered_list' ? OrderedList : UnOrderedList;
  return (
    <div style={{ marginLeft: '0.5rem' }}>
      <Text strong style={{ fontSize: '0.875rem' }}>
        {config.data.header}
      </Text>
      <List>
        {config.data.items.map((item: string, index: number) => (
          <li key={index} style={{ fontSize: '0.875rem', color: '#000' }}>
            <Text style={{ fontSize: '0.875rem' }}>{item}</Text>
          </li>
        ))}
      </List>
    </div>
  );
};
