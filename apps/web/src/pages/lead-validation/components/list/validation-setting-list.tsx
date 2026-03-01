import { type FC } from 'react';
import { BasicTable } from '@dzone/shared-ui';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { IValidationSettingRow } from '../../lib/types';
import { ValidationSettingRecordAction } from './validation-setting-record-action';

interface Props {
  validationSettings: IValidationSettingRow[];
  handleRowClick?: (record: IValidationSettingRow) => void;
}

export const ValidationSettingList: FC<Props> = ({ validationSettings, handleRowClick }) => {
  const columns: ColumnsType<IValidationSettingRow> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 350,
    },
    {
      title: 'Marketer',
      dataIndex: ['tenant', 'name'],
      key: 'tenant.name',
      ellipsis: true,
      width: 350,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => (createdAt ? dayjs(createdAt).format('DD MMM YYYY') : '-'),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_: any, record: IValidationSettingRow) => (
        <ValidationSettingRecordAction validationSetting={record} />
      ),
    },
  ];

  return (
    <BasicTable<IValidationSettingRow>
      columns={columns}
      data={validationSettings}
      hasPagination={false}
      onClick={(record) => handleRowClick?.(record as IValidationSettingRow)}
      scrollableHeight={500}
    />
  );
};
