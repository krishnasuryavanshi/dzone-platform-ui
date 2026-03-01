import { Breadcrumb } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './view-campaign-breadcrumb.module.css';

interface IViewCampaignBreadcrumbProps {
  campaignId?: string;
}

export const ViewCampaignBreadcrumb: FC<IViewCampaignBreadcrumbProps> = ({
  campaignId,
}) => {
  const { t } = useTranslation();

  const breadcrumb = [
    {
      title: t('pages.campaignManagement.title'),
    },
    {
      title: (
        <span className={`${styles.campaignId} ${styles.hoverUnderline}`}>
          {campaignId}
        </span>
      ),
    },
    {
      title: t('pages.campaigns.label.viewCampaign'),
    },
  ];

  return <Breadcrumb items={breadcrumb} />;
};
