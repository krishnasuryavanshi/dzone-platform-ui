import { type FC } from 'react';
import { Button, Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import type { MenuProps } from 'antd';
import { IValidationSettingRow } from '../../lib/types';

interface Props {
  validationSetting: IValidationSettingRow;
}

export const ValidationSettingRecordAction: FC<Props> = ({ validationSetting }) => {
  const baseLink = `/lead-validation-settings/organizations/${validationSetting.tenant.code}/settings/${validationSetting.id}`;

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Link to={baseLink}>View</Link>,
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <Button
        onClick={(e) => e.stopPropagation()}
        icon={<MoreOutlined />}
        type="text"
      />
    </Dropdown>
  );
};
