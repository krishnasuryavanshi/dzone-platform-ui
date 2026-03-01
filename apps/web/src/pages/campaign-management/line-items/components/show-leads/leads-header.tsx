import { useTranslation } from 'react-i18next';
import { Flex, Typography } from 'antd';
import { DZONE_CLR_GRAY_4 } from '@dzone/shared-lib';
import { FC } from 'react';
import { LeadsActions } from './leads-actions';
// TODO: Import from leads module once migrated
// import { useLeadsCountStore } from '../../../leads/store';

const { Title } = Typography;

interface ILeadsHeaderProps {
  lineItemId: string;
  totalFilteredLeads: number;
  leadStatus: string[];
  validationStatus: string[];
  refreshLeadsList: () => void;
  tenantCode?: string;
}

export const LeadsHeader: FC<ILeadsHeaderProps> = ({
  lineItemId,
  totalFilteredLeads,
  leadStatus,
  validationStatus,
  refreshLeadsList,
  tenantCode,
}) => {
  const { t } = useTranslation();
  // TODO: Import from leads module once migrated
  // const totalLeads = useLeadsCountStore((state) => state.totalLeads);
  const totalLeads = 0;

  return (
    <Flex
      style={{
        borderRadius: '0.5rem',
        background: DZONE_CLR_GRAY_4,
      }}>
      <Flex justify='space-between' align='center' style={{ height: '2.5rem', width: '100%' }}>
        <Title level={5} style={{ marginBottom: 0 }}>
          {t('pages.lineItems.label.totalLeads')} ({totalLeads})
        </Title>

        <LeadsActions
          lineItemId={lineItemId}
          totalFilteredLeads={totalFilteredLeads}
          leadStatus={leadStatus}
          validationStatus={validationStatus}
          refreshLeadsList={refreshLeadsList}
          tenantCode={tenantCode}
        />
      </Flex>
    </Flex>
  );
};
