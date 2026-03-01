import { FC } from 'react';
import { Flex, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { usePermissionCheck } from '@dzone/shared-auth';
import { LineItemActionsEnum } from '@dzone/shared-lib';
import { LineItemsActions } from './line-items-actions';
// TODO: CreateLineIitemContainer needs to be migrated from campaigns/create-line-item
// import { CreateLineIitemContainer } from '../create-line-item';

const { Title } = Typography;

interface ILineItemHeaderProps {
  totalLineItems: number;
  campaignId: string;
  campaignUuId: string;
  showCreateLineItem: boolean;
  handelCreateLineItemForm: (isOpen: boolean) => void;
}

export const LineItemHeader: FC<ILineItemHeaderProps> = ({
  totalLineItems,
}) => {
  const { t } = useTranslation();
  const hasCreatePermission = usePermissionCheck(LineItemActionsEnum.Create);

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ height: '2.5rem' }}>
        <Title level={5} style={{ marginBottom: 0 }}>
          {t('pages.lineItems.title')} ({totalLineItems})
        </Title>
        {hasCreatePermission && <LineItemsActions />}
      </Flex>
      {/* TODO: CreateLineIitemContainer needs to be migrated from campaigns/create-line-item */}
      {/* <CreateLineIitemContainer
        show={showCreateLineItem}
        campaignUuid={campaignUuId}
        campaignId={campaignId}
        handleCloseLineItemForm={() => handelCreateLineItemForm(false)}
      /> */}
    </div>
  );
};
