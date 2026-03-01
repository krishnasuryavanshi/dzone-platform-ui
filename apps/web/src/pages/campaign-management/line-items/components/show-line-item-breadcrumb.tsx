import { useTranslation } from 'react-i18next';
import { Breadcrumb } from 'antd';
import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { FC, useEffect, useState } from 'react';
import styles from './show-line-item-breadcrumb.module.css';

interface IShowLineItemBreadcrumbProps {
  campaignUuid?: string;
  campaignId?: string;
  id?: string;
  lineItemId?: string;
}

export const ShowLineItemBreadcrumb: FC<IShowLineItemBreadcrumbProps> = ({
  campaignUuid,
  campaignId,
  lineItemId,
}) => {
  const { t } = useTranslation();

  const [items, setItems] = useState<ItemType[]>([
    {
      title: t('pages.campaignManagement.title'),
    },
  ]);

  useEffect(() => {
    if (campaignUuid && campaignId && lineItemId) {
      setItems([
        {
          title: t('pages.campaignManagement.title'),
        },
        {
          title: campaignId,
          href: `/campaign-management/campaigns/${campaignUuid}`,
        },
        {
          title: <span className={styles.lineItemId}>{lineItemId}</span>,
        },
        {
          title: t('pages.lineItems.label.viewLineItem'),
        },
      ]);
    } else {
      setItems([
        {
          title: t('pages.campaignManagement.title'),
        },
        {
          title: <span className={styles.lineItemId}>{lineItemId}</span>,
        },
        {
          title: t('pages.lineItems.label.viewLineItem'),
        },
      ]);
    }
  }, [campaignUuid, campaignId, lineItemId]);

  return <Breadcrumb items={items} />;
};
