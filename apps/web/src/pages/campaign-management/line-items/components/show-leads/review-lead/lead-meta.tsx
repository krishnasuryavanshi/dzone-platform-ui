import { Hideable } from '@dzone/shared-ui';
import { LeadActionsEnum } from '@dzone/shared-lib';
import { usePermissionCheck } from '@dzone/shared-auth';
import { Button, Flex, Typography } from 'antd';
import { FC, PropsWithChildren } from 'react';
import { LeadMetaRow } from './lead-meta-row';
import { ValidationStatus } from './validation-status';

const { Text } = Typography;

interface ILeadMetaProps extends PropsWithChildren {
  validationStatus: string;
  trackingId: string;
  handleSaveAndRevalidate: () => void;
  revalidationAllowed?: boolean;
  disableRevalidate: boolean;
}

export const LeadMeta: FC<ILeadMetaProps> = ({
  children,
  trackingId,
  validationStatus,
  handleSaveAndRevalidate,
  revalidationAllowed,
  disableRevalidate,
}) => {
  const hasValidatePermission = usePermissionCheck(LeadActionsEnum.ValidateLead);

  return (
    <Flex vertical gap={'0.5rem'}>
      {children}
      <LeadMetaRow label='Tracking ID' className='tracking-id'>
        <Text style={{ fontSize: '0.875rem', width: '15rem' }}>
          {trackingId}
        </Text>
      </LeadMetaRow>
      <LeadMetaRow label='Validation Status' className='validation-status'>
        <ValidationStatus validationStatus={validationStatus} />
      </LeadMetaRow>
      <Hideable show={hasValidatePermission}>
        <Hideable show={!!revalidationAllowed}>
          <LeadMetaRow label='Actions' className='actions'>
            <Button
              type='primary'
              onClick={handleSaveAndRevalidate}
              disabled={disableRevalidate}
              style={{ width: 'fit-content' }}>
              Save & Revalidate
            </Button>
          </LeadMetaRow>
        </Hideable>
      </Hideable>
    </Flex>
  );
};
