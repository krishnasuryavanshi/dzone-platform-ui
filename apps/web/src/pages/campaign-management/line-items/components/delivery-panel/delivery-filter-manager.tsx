import { Flex } from 'antd';
import { FC } from 'react';
import { TemplateDropdown } from './template-dropdown';
import { LeadStatusFileType } from '../../lib/enums';
import { LeadStatusDropdown } from '../lead-status-dropdown';
import { ITemplateInfo } from '../../lib/types/template';

interface IDeliveryFilterManagerProps {
  selectedTemplate: ITemplateInfo | null;
  updateSelectedTemplate: (template: ITemplateInfo) => void;
  selectedLeadStatuses: string[];
  updateSelectedLeadStatuses: (statuses: string[]) => void;
  tenantCode?: string;
  lineItemId?: string;
}

export const DeliveryFilterManager: FC<IDeliveryFilterManagerProps> = ({
  selectedLeadStatuses,
  updateSelectedLeadStatuses,
  updateSelectedTemplate,
  selectedTemplate,
  tenantCode,
  lineItemId,
}) => {
  return (
    <Flex gap={'0.5rem'} vertical align='top' style={{ width: '100%' }}>
      <LeadStatusDropdown
        onLeadsStatusChange={updateSelectedLeadStatuses}
        selected={selectedLeadStatuses}
        isFileType={LeadStatusFileType.Delivery}
      />
      <TemplateDropdown
        onTemplateChange={updateSelectedTemplate}
        selectedTemplate={selectedTemplate}
        tenantCode={tenantCode}
        lineItemId={lineItemId}
      />
    </Flex>
  );
};
