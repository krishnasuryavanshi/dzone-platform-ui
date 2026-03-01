import { useTranslation } from 'react-i18next';
import { Breadcrumb } from 'antd';
import { useEffect, useState } from 'react';
import { ILineItem } from '../../lib/types';
import { Link } from 'react-router';
import { ICampaign } from '../../../campaigns/lib/types';
import styles from './line-item-breadcrumbs.module.css';

export interface ICreateLineItemBreadcrumbsProps {
  campaignData?: ICampaign;
  id?: string;
  lineItemId?: string;
  lineItemDetails?: ILineItem;
}

export const LineItemBreadcrumbs: React.FC<ICreateLineItemBreadcrumbsProps> = ({
  campaignData,
  id,
  lineItemId,
}) => {
  const { t } = useTranslation();
  const campaignId = campaignData?.campaignId;
  const [items, setItems] = useState<any[]>([
    {
      title: t('pages.campaignManagement.title'),
    },
  ]);

  useEffect(() => {
    if (campaignId && id && lineItemId) {
      setItems([
        {
          title: t('pages.campaignManagement.title'),
        },
        {
          title: (
            <Link to={`/campaign-management/campaigns/${campaignId}`}>
              {campaignId}
            </Link>
          ),
        },
        {
          title: (
            <span className={`${styles.lineItemId} ${styles.hoverUnderline}`}>
              <Link to={`/campaign-management/line-items/${id}`}>
                {lineItemId}
              </Link>
            </span>
          ),
        },
        {
          title: t('form.editLineItem.edit'),
        },
      ]);
    } else if (campaignData?.id && !id && !lineItemId) {
      setItems([
        {
          title: t('pages.campaignManagement.title'),
        },
        {
          title: (
            <Link to={`/campaign-management/campaigns/${campaignData?.id}`}>
              {campaignId!}
            </Link>
          ),
        },
        {
          title: t('form.createLineItem.create'),
        },
      ]);
    } else if (lineItemId && id) {
      setItems([
        {
          title: t('pages.campaignManagement.title'),
        },
        {
          title: (
            <span className={`${styles.lineItemId} ${styles.hoverUnderline}`}>
              <Link to={`/campaign-management/line-items/${id}`}>
                {lineItemId}
              </Link>
            </span>
          ),
        },
        {
          title: t('form.editLineItem.edit'),
        },
      ]);
    }
  }, [campaignId, id, lineItemId]);

  return <Breadcrumb items={items} />;
};
