import { FC } from 'react';
import { BasicTable } from '@dzone/shared-ui';
import { useScrollableTableHeight } from '@dzone/shared-lib';
import { useTranslation } from 'react-i18next';
import { IPacingChartType } from '../../../lib/types';

interface IPacingListsProps {
  pacingData: IPacingChartType[];
}

const StaticContentHeight = 100;

export const PacingLists: FC<IPacingListsProps> = ({ pacingData }) => {
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);
  const { t } = useTranslation();

  const columns = [
    {
      title: t('pages.lineItems.pacingChart.serial'),
      dataIndex: 'serialNo',
      key: 'serialNo',
      ellipsis: true,
      width: 100,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t('pages.lineItems.pacingChart.date'),
      dataIndex: 'date',
      key: 'date',
      ellipsis: true,
      width: 100,
    },
    {
      title: t('pages.lineItems.pacingChart.dayOfAWeek'),
      dataIndex: 'dayOfAWeek',
      key: 'dayOfAWeek',
      ellipsis: true,
      width: 100,
    },
    {
      title: t('pages.lineItems.pacingChart.leadsRequired'),
      dataIndex: 'leadsRequired',
      key: 'leadsRequired',
      ellipsis: true,
      width: 100,
    },
  ];

  return (
    <BasicTable
      className='row-hover-highlight'
      scrollableHeight={scrollableTableHeight}
      columns={columns}
      data={pacingData || []}
      hasPagination={false}
      onClick={() => null}
    />
  );
};
