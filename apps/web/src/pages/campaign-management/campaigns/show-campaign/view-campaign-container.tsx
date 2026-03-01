import { FC, useEffect, useState } from 'react';
import { Flex } from 'antd';
import { debounce } from 'lodash-es';
import { useAuthStore, usePermissionsStore } from '@dzone/shared-store';
import { RestrictedAccessKeys } from '@dzone/shared-lib';
import { ICampaign } from '../lib/types';
import { CampaignSummaryViewFields } from '../lib/constants';
import { CampaignField } from '../lib/enums';
import { prepareViewData } from '../lib/utils/prepare-view-data';
import { fetchCampaignDetails } from '../services';
import { ShowItemDetails } from '../../components/show-page';
import { IShowItemDetailsProps } from '../../lib/types';
import { ViewCampaignBreadcrumb } from './view-campaign-breadcrumb';
import { LineItemsContainer } from './line-items-container';
// TODO: campaign-form.json schema needs to be migrated to the platform
// import CampaignDetailsSchema from '../lib/schemas/campaign-form.json';
const CampaignDetailsSchema = {} as Record<string, any>;

interface IViewCampaignContainerProps {
  campaignId: string;
  isDzoneUser?: boolean;
}

export const ViewCampaignContainer: FC<IViewCampaignContainerProps> = ({
  campaignId,
}) => {
  const { user } = useAuthStore();
  const { modules } = usePermissionsStore();
  const restrictedKeys = user?.restrictedAccessKeys || [];

  const isIONumberRestricted = restrictedKeys.includes(
    RestrictedAccessKeys.IONumberFieldInCampaignDetails,
  );
  const isUploadIOFileRestricted = restrictedKeys.includes(
    RestrictedAccessKeys.UploadIOFileFieldInCampaignDetails,
  );
  const isBookedRevenueRestricted = restrictedKeys.includes(
    RestrictedAccessKeys.BookedRevenueFieldInCampaignDetails,
  );

  const [campaignDetails, setCampaignDetails] = useState<ICampaign>();
  const [detailsSectionProps, setDetailsSectionProps] =
    useState<IShowItemDetailsProps>({
      pageLabel: 'pages.campaigns.label.campaignDetails',
      formConfig: CampaignDetailsSchema,
      summaryViewFields: CampaignSummaryViewFields,
      updateUrl: 'edit',
    } as IShowItemDetailsProps);
  const [restrictedFields, setRestrictedFields] = useState<
    (boolean | string)[]
  >([]);

  useEffect(() => {
    setRestrictedFields([
      isIONumberRestricted && CampaignField.IoNumber,
      isUploadIOFileRestricted,
      isBookedRevenueRestricted && CampaignField.BookedRevenue,
    ]);
  }, [
    isBookedRevenueRestricted,
    isUploadIOFileRestricted,
    isIONumberRestricted,
  ]);

  useEffect(() => {
    if (campaignId && modules?.length && restrictedFields.length) {
      debouncedFetchCampaign();
    }
  }, [campaignId, modules, restrictedFields]);

  const fetchCampaign = async () => {
    const data = await fetchCampaignDetails(campaignId);
    let ioFileDetails = {};
    if (data?.data?.ioFileId) {
      // TODO: fetchFileDetails needs to be migrated from line-items/services
      // const ioFileResponse = await fetchFileDetails(data?.data?.ioFileId);
      // ioFileDetails = ioFileResponse;
      ioFileDetails = {};
    }
    const viewData = prepareViewData(data?.data, {
      restrictedFields,
    });

    const updatedCampaignDetails = {
      ...viewData,
      ioFileId: ioFileDetails,
    };

    setCampaignDetails(updatedCampaignDetails);
    setDetailsSectionProps({
      ...detailsSectionProps,
      itemDetails: updatedCampaignDetails,
    });
  };

  const debouncedFetchCampaign = debounce(fetchCampaign, 100);

  return (
    <Flex vertical style={{ height: '100%', overflow: 'auto' }}>
      <Flex
        vertical
        style={{
          padding: '0.5rem',
          paddingBottom: '0rem',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          background: '#fff',
        }}
      >
        <ViewCampaignBreadcrumb campaignId={campaignDetails?.campaignId} />
      </Flex>
      <Flex vertical style={{ padding: '0.5rem', paddingTop: '0rem', flex: 1 }}>
        <ShowItemDetails {...detailsSectionProps} type="campaign" />
        <LineItemsContainer
          campaignId={campaignDetails?.campaignId}
          campaignUuId={campaignId}
        />
      </Flex>
    </Flex>
  );
};
