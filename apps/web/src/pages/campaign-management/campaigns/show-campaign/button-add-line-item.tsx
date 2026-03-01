import { FC, useState } from 'react';
import { Button, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { validateCreateLineItemsAction } from '../services';

export const ButtonAddLineItem: FC = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createLineItemUrl = `/campaign-management/line-items/create?campaignId=${campaignId}`;

  const validateCreateLineItemAction = async () => {
    setIsLoading(true);
    try {
      const data = await validateCreateLineItemsAction(campaignId as string);
      if (data?.data) {
        navigate(createLineItemUrl, { replace: true });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error as string,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="primary"
      className="dz-btn-action-1"
      size="small"
      style={{ width: '7.5rem' }}
      disabled={isLoading}
      onClick={(e) => {
        e.stopPropagation();
        validateCreateLineItemAction();
      }}
    >
      {isLoading ? (
        <LoadingOutlined />
      ) : (
        t('pages.campaigns.label.addLineItem')
      )}
    </Button>
  );
};
