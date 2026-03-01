import { FC, useEffect, useState } from 'react';
import { Flex } from 'antd';
import { useParams } from 'react-router';
import { useAuthStore } from '@dzone/shared-store';
import { usePermissionCheck } from '@dzone/shared-auth';
import { DzentActionsEnum } from '@dzone/shared-lib';
import { ICampaign } from '../lib/types';
import { BreadCrumbContainer } from './breadcrumb-container';
import { FormContainer } from './form-container';
import { fetchCampaignDetails } from '../services';
import { AiCampaignCreate } from './ai-campaign-create';

export const CreateCampaignForm: FC = () => {
  const { campaignUUId } = useParams<{ campaignUUId: string }>();
  const { isDzoneUser, tenantCode, user } = useAuthStore();
  const hasDzentPermission = usePermissionCheck(DzentActionsEnum.View);

  const [campaignData, setCampaignData] = useState<ICampaign | null>(null);

  const fetchCampaign = async () => {
    if (!campaignUUId) return;
    const { data } = await fetchCampaignDetails(campaignUUId, false);
    setCampaignData(data);
  };

  useEffect(() => {
    fetchCampaign();
  }, [campaignUUId]);

  return (
    <>
      <Flex
        vertical
        style={{ height: '100%', overflow: 'auto' }}
      >
        <Flex
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: '#fff',
          }}
        >
          <BreadCrumbContainer
            campaignId={campaignData?.campaignId}
            id={campaignUUId}
          />
        </Flex>
        <Flex
          vertical
          gap="0.5rem"
          style={{
            padding: '0.5rem',
            position: 'relative',
            paddingBottom: '0rem',
            height: '100%',
          }}
        >
          <Flex vertical gap="0.75rem">
            <FormContainer
              campaignData={campaignData}
              campaignUUId={campaignUUId}
              tenantCode={tenantCode}
              userId={user?.userId}
              isDzoneUser={isDzoneUser}
            />
          </Flex>
        </Flex>
      </Flex>
      {!campaignUUId && hasDzentPermission && <AiCampaignCreate />}
    </>
  );
};
