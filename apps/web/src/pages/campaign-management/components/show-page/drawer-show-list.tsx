import { Drawer, Button, List } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export const DrawerShowList = ({
  label,
  show,
  list,
  hasChildren,
  handleClose,
}: {
  show: boolean;
  list: any[];
  label: string;
  hasChildren: boolean;
  handleClose: () => void;
}) => {
  const { t } = useTranslation();

  if (!show) return null;
  return (
    <Drawer
      title={t(label)}
      closeIcon={null}
      onClose={handleClose}
      placement='right'
      footer={null}
      open={show}>
      <Button
        icon={<CloseOutlined />}
        onClick={handleClose}
        className='custom-drawer-close-button'
      />
      <List
        bordered
        style={{ maxHeight: '85vh', overflow: 'auto' }}
        size='small'
        itemLayout='horizontal'
        dataSource={list}
        renderItem={(item, index) => (
          <>
            <List.Item>
              {index + 1}. {hasChildren ? item.label : item}
            </List.Item>
            {hasChildren
              ? item.children.map((child: string, idNumber: number) => (
                  <List.Item key={idNumber + 1} style={{ paddingLeft: '2rem' }}>
                    {idNumber + 1}. {child}
                  </List.Item>
                ))
              : null}
          </>
        )}
      />
    </Drawer>
  );
};
