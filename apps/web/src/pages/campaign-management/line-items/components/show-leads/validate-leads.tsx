import { useTranslation } from 'react-i18next';
import { Button, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { FC, useState } from 'react';
// TODO: Import from leads module once migrated
// import { validateLeads } from '../../../leads/services/validate-leads';
// import { IValidateLeads } from '../../../leads/lib/types';
import { NO_LEADS_FOR_VALIDATION_ERROR_MESSAGE } from '../../../lib/constants';

interface IValidateLeadsProps {
  lineItemId: string;
  totalFilteredLeads: number;
  leadStatus: string[];
  validationStatus: string[];
}

export const ValidateLeads: FC<IValidateLeadsProps> = ({
  lineItemId: _lineItemId,
  leadStatus: _leadStatus,
  validationStatus: _validationStatus,
  totalFilteredLeads,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLeadsValidation = async () => {
    if (totalFilteredLeads > 0) {
      setIsLoading(true);
      try {
        // TODO: Import from leads module once migrated
        // const requestPayload: IValidateLeads = {
        //   lineItemId,
        //   totalLeads: totalFilteredLeads,
        //   leadStatus,
        //   validationStatus,
        //   leadInfo: [],
        //   isSanitationSystem: true,
        // };
        // const data = await validateLeads(requestPayload);
        // if (data.data) {
        //   notification.success({ message: data.message });
        // }
      } catch (e) {
        // Handle error if needed
      } finally {
        setIsLoading(false);
      }
    } else {
      notification.error({
        message: NO_LEADS_FOR_VALIDATION_ERROR_MESSAGE,
      });
    }
  };

  return (
    <Button
      type='primary'
      size='small'
      style={{ width: '5.6rem', boxShadow: 'none' }}
      disabled={isLoading}
      onClick={handleLeadsValidation}>
      {isLoading ? (
        <LoadingOutlined style={{ marginLeft: '0.5rem' }} />
      ) : (
        t('pages.leads.validate')
      )}
    </Button>
  );
};
