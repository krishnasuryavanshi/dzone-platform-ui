import { useTranslation } from 'react-i18next';
import { Flex, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { FC, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { usePermissionCheck } from '@dzone/shared-auth';
import { LeadActionsEnum, ViewJobPermissions } from '@dzone/shared-lib';
import { LineItemsTabType } from '../lib/enums/line-items-tabs.enum';
import { ShowLineItemsTabsContent } from './show-line-items-tabs-content';

interface IShowLineItemTabsProps {
  lineItemId: string;
  tenantCode?: string;
  sessionTenantCode?: string | string[];
}

export const ShowLineItemTabs: FC<IShowLineItemTabsProps> = ({
  lineItemId,
  tenantCode,
  sessionTenantCode,
}) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const canViewLeads = usePermissionCheck(LeadActionsEnum.View);
  const hasPermissiontoTransformAndExport = usePermissionCheck(
    LeadActionsEnum.TransformAndExportLead,
  );
  const canViewJobs = usePermissionCheck(ViewJobPermissions.Jobs);

  const tabParam = searchParams.get('tab');
  const initialTab =
    tabParam === 'delivery' && hasPermissiontoTransformAndExport
      ? LineItemsTabType.Delivery
      : canViewLeads
        ? LineItemsTabType.Leads
        : LineItemsTabType.Files;

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'delivery' && hasPermissiontoTransformAndExport) {
      setActiveTab(LineItemsTabType.Delivery);
    }
  }, [searchParams, hasPermissiontoTransformAndExport]);

  const items: TabsProps['items'] = [
    ...(canViewLeads
      ? [
          {
            key: LineItemsTabType.Leads,
            label: t('Leads'),
          },
        ]
      : []),
    //  Temporary commented out Files tab as it is not in use currently
    // {
    //   key: LineItemsTabType.Files,
    //   label: t('Files'),
    // },
    ...(hasPermissiontoTransformAndExport
      ? [
          {
            key: LineItemsTabType.Delivery,
            label: t('Delivery'),
          },
        ]
      : []),
    ...(canViewJobs
      ? [
          {
            key: LineItemsTabType.Jobs,
            label: t('Jobs'),
          },
        ]
      : []),
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  if (items.length === 0) {
    return null;
  }
  return (
    <Flex vertical>
      <Flex
        style={{
          boxShadow: '4px 4px 10px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: '0.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          background: '#fff',
        }}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={items}
        />
      </Flex>
      <ShowLineItemsTabsContent
        activeTab={activeTab}
        lineItemId={lineItemId}
        tenantCode={tenantCode}
        sessionTenantCode={sessionTenantCode}
      />
    </Flex>
  );
};
