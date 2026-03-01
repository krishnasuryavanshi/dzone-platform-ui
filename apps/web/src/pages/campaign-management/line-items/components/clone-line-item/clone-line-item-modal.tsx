import { Modal, notification } from 'antd';
import { useQueryState } from '@dzone/shared-lib';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ModalHeader } from './modal-header';
import { ModalFooter } from './modal-footer';
import { ModalBody } from './modal-body';
import { cloneLineItem, fetchCampaignsByMarketer } from '../../services';
import { IActiveCampaignList } from '../../lib/types';

interface ICloneLineItemContainerProps {
  lineItemId: string;
  campaignId: string;
  openModal: boolean;
  editLineItemLink: string;
  closeModal: () => void;
  marketerCode?: string;
}

const LINE_ITEM_SOURCE = '/campaign-management/line-items';

export const CloneLineItemModal: FC<ICloneLineItemContainerProps> = ({
  lineItemId,
  campaignId,
  openModal,
  closeModal,
  editLineItemLink,
  marketerCode,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setQueryState } = useQueryState();

  const [selectedActiveCampaign, setSelectedActiveCampaign] =
    useState<string>('');
  const [activeCampaignList, setActiveCampaignList] = useState<
    IActiveCampaignList[]
  >([]);
  const [loadingClone, setLoadingClone] = useState<boolean>(false);
  const [loadingCloneEdit, setLoadingCloneEdit] = useState<boolean>(false);

  const campaignList = async () => {
    if (marketerCode) {
      const data = await fetchCampaignsByMarketer(marketerCode);
      setActiveCampaignList(data || []);
    } else {
      setActiveCampaignList([]);
    }
  };

  const selectCampaign = (campaign: string) => {
    setSelectedActiveCampaign(campaign);
  };

  useEffect(() => {
    if (openModal) {
      campaignList();
    }
  }, [openModal]);

  useEffect(() => {
    if (activeCampaignList?.length > 0) {
      const selectedCampaign = activeCampaignList.find(
        (campaign) => campaign.id === campaignId,
      );
      setSelectedActiveCampaign(selectedCampaign?.id || '');
    }
  }, [campaignId, activeCampaignList]);

  const handleCancel = (e: SyntheticEvent) => {
    e.stopPropagation();
    closeModal();
  };

  const handleClone = async (e: SyntheticEvent, isEditing: boolean) => {
    e.stopPropagation();
    if (isEditing) {
      setLoadingCloneEdit(true);
    } else {
      setLoadingClone(true);
    }
    try {
      const data = await cloneLineItem(lineItemId, {
        campaignId: selectedActiveCampaign!,
      });
      if (data?.data) {
        notification.success({ message: data.message });
        closeModal();
        if (
          location.pathname !== LINE_ITEM_SOURCE &&
          selectedActiveCampaign !== campaignId
        ) {
          navigate(LINE_ITEM_SOURCE, { replace: true });
        } else if (isEditing) {
          navigate(editLineItemLink, { replace: true });
        } else {
          setQueryState([{ name: 'refresh_id', value: new Date().getTime() }]);
        }
      }
    } catch (error) {
    } finally {
      if (isEditing) {
        setLoadingCloneEdit(false);
      } else {
        setLoadingClone(false);
      }
    }
  };

  return (
    <Modal
      width={'40%'}
      open={openModal}
      onCancel={handleCancel}
      title={<ModalHeader />}
      footer={
        <ModalFooter
          loadingClone={loadingClone}
          loadingCloneEdit={loadingCloneEdit}
          handleCancel={handleCancel}
          handleSubmit={handleClone}
        />
      }
      destroyOnClose
      maskClosable={false}>
      <ModalBody
        activeCampaignList={activeCampaignList}
        selectedActiveCampaign={selectedActiveCampaign!}
        selectCampaign={selectCampaign}
      />
    </Modal>
  );
};
