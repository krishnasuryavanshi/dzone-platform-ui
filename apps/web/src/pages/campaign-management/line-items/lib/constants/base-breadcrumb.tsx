import { t } from 'i18next';

export const BaseBreadcrumb = [
  {
    title: t('pages.campaignManagement.title'),
  },
  {
    title: t('pages.campaigns.title'),
    href: '/campaign-management/campaigns',
  },
  {
    title: t('pages.lineItems.title'),
    href: '/campaign-management/line-items',
  },
];
