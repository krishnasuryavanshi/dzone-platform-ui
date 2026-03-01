import { Flex, Typography } from 'antd';
import { Hideable } from '@dzone/shared-ui';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { ShowDetailsSectionFooterAction } from '../../../components/show-page/show-details-section-footer-actions';
import { ShowLineItemFields } from './show-line-item-fields';
import { ILineItem } from '../../lib/types';
import { ICampaign } from '../../../campaigns/lib/types';
import { LeadValidationSettingsContainer } from '../lead-validation-settings';

const { Text } = Typography;

export interface IShowItemFieldsProps {
  itemDetails?: ILineItem | ICampaign | Record<string, any>;
  formConfig: any;
  isCollapsed: boolean;
  summaryViewFields: string[];
}

export interface IShowLineItemDetailsProps extends IShowItemFieldsProps {
  updateUrl: string;
  stepCount?: number;
  pageLabel: string;
  type: 'lineItem';
}

export const ShowLineItemDetails: FC<IShowLineItemDetailsProps> = ({
  itemDetails,
  updateUrl,
  formConfig,
  summaryViewFields,
  pageLabel,
  type,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [updateLink, setUpdateLink] = useState('');

  useEffect(() => {
    if (itemDetails) {
      const updateItemLink = `${location.pathname}/${updateUrl}`;
      setUpdateLink(updateItemLink);
    }
  }, [itemDetails]);
  const handleCollapse = (collapsedState: boolean) => {
    setIsCollapsed(collapsedState);
  };

  return (
    <Flex vertical gap='0.75rem'>
      <Text strong style={{ marginBottom: '0' }}>
        {t(pageLabel)}
      </Text>

      <Flex vertical>
        <ShowDetailsSectionFooterAction
          itemUuid={itemDetails?.id}
          marketerCode={itemDetails?.marketerCode}
          formConfig={formConfig}
          type={type}
          isCollapsed={isCollapsed}
          handleCollapse={handleCollapse}
          updateLink={updateLink}
        />
        <ShowLineItemFields
          itemDetails={itemDetails as ILineItem}
          formConfig={formConfig}
          isCollapsed={isCollapsed}
          summaryViewFields={summaryViewFields}
        />
        <Hideable
          show={
            !!(
              (
                type === 'lineItem' &&
                itemDetails?.id &&
                (itemDetails as ILineItem).validationSettingsId &&
                !isCollapsed
              )
            )
          }>
          <LeadValidationSettingsContainer
            lineItemId={itemDetails?.id as string}
            leadValidationSettingId={
              (itemDetails as ILineItem)?.validationSettingsId
            }
          />
        </Hideable>
      </Flex>
    </Flex>
  );
};
