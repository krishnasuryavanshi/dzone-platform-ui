import { FC, useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './show-create-campaign-breadcrumbs.module.css';

interface IShowCampaignBreadcrumbProps {
  campaignId?: string;
  id?: string;
}

export const ShowCampaignBreadcrumb: FC<IShowCampaignBreadcrumbProps> = ({
  campaignId,
  id,
}) => {
  const { t } = useTranslation();

  const [items, setItems] = useState<{ title: React.ReactNode }[]>([
    {
      title: t('pages.campaignManagement.title'),
    },
    {
      title: t(
        campaignId
          ? 'form.createCampaign.editFormHeader'
          : 'form.createCampaign.formHeader',
      ),
    },
  ]);

  useEffect(() => {
    if (campaignId && id) {
      setItems([
        {
          title: t('pages.campaignManagement.title'),
        },
        {
          title: (
            <span
              className={`${styles.campaignId} ${styles.hoverUnderline}`}
            >
              <Link to={`/campaign-management/campaigns/${id}`}>
                {campaignId}
              </Link>
            </span>
          ),
        },
        {
          title: t(
            campaignId
              ? 'form.createCampaign.editFormHeader'
              : 'form.createCampaign.formHeader',
          ),
        },
      ]);
    }
  }, [campaignId, id]);

  return <Breadcrumb items={items} />;
};
