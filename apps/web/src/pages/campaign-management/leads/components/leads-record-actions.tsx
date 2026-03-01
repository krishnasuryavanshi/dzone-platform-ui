import { Button, Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Link } from 'react-router';

interface ILeadsRecordActionsProps {
  lineItemId: string;
  campaignId: string;
  clientId: string;
}

export const LeadsRecordActions: FC<ILeadsRecordActionsProps> = ({
  lineItemId,
  campaignId,
  clientId,
}) => {
  const items = [
    {
      key: '1',
      label: (
        <Link
          to={`/campaign-management/clients/${clientId}/campaigns/${campaignId}/line-items/${lineItemId}`}
        >
          View Line Item
        </Link>
      ),
    },
  ];
  return (
    <Dropdown menu={{ items }} placement='bottomLeft'>
      <Button type='default' icon={<MoreOutlined />} />
    </Dropdown>
  );
};
