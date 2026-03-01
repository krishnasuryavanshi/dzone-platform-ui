import React, { FC, SyntheticEvent } from 'react';
import { Button, Dropdown, Typography, notification } from 'antd';
import { Link, useNavigate } from 'react-router';
import { usePermissionCheck } from '@dzone/shared-auth';
import { useQueryState, CampaignActionsEnum, LineItemActionsEnum } from '@dzone/shared-lib';
import { ThreeDotsActionsIcon } from '@dzone/shared-ui';
import { ICampaign } from '../lib/types';
import { generateCampaignLinks } from '../lib/utils';
import {
  cloneCampaign,
  validateCampaign,
  validateCreateLineItemsAction,
} from '../services';
import { useCampaignStore } from '../stores/use-campaign-store';

const { Link: AntLink } = Typography;

interface ICampaignRowActionsProps {
  campaign: ICampaign;
}

type PermissionKeys = `${LineItemActionsEnum}` | `${CampaignActionsEnum}`;

type ItemConfig = {
  key: string;
  permission: PermissionKeys;
  label: React.ReactNode;
};

export const CampaignRowActions: FC<ICampaignRowActionsProps> = ({
  campaign,
}) => {
  const { setQueryState } = useQueryState();
  const { showLoader } = useCampaignStore();
  const navigate = useNavigate();

  const permissions: Partial<Record<PermissionKeys, boolean>> = {
    [CampaignActionsEnum.View]: usePermissionCheck(CampaignActionsEnum.View),
    [CampaignActionsEnum.Edit]: usePermissionCheck(CampaignActionsEnum.Edit),
    [LineItemActionsEnum.Create]: usePermissionCheck(
      LineItemActionsEnum.Create,
    ),
    [LineItemActionsEnum.View]: usePermissionCheck(LineItemActionsEnum.View),
    [CampaignActionsEnum.Create]: usePermissionCheck(
      CampaignActionsEnum.Create,
    ),
  };

  const listOfLineItemLink = generateCampaignLinks(campaign, 'lineItems');
  const createLineItemLink = generateCampaignLinks(campaign, 'createLineItems');
  const editCampaignLink = generateCampaignLinks(campaign, 'editCampaign');
  const viewCampaignLink = generateCampaignLinks(campaign);

  const cloneCampaignAction = async (e: SyntheticEvent) => {
    e.stopPropagation();
    const data = await cloneCampaign(campaign.id);
    if (data.data) {
      notification.success({ message: data.message });
      setQueryState([{ name: 'page', value: 0 }]);
    }
  };

  const validateCampaignDetails = async (campaignId: string) => {
    showLoader(true);
    try {
      const data = await validateCampaign(campaignId);
      if (data?.data) {
        navigate(editCampaignLink, { replace: true });
      }
    } catch (error) {
      notification.error({ message: error as string });
    } finally {
      showLoader(false);
    }
  };

  const validateCreateLineItemAction = async (campaignId: string) => {
    showLoader(true);
    try {
      const data = await validateCreateLineItemsAction(campaignId);
      if (data?.data) {
        navigate(createLineItemLink, { replace: true });
      }
    } catch (error) {
      notification.error({ message: error as string });
    } finally {
      showLoader(false);
    }
  };

  const ACTION_MAPPING: Partial<
    Record<
      PermissionKeys,
      (
        campaign: ICampaign,
        stopPropagation: (e: SyntheticEvent) => void,
      ) => React.ReactNode
    >
  > = {
    [CampaignActionsEnum.View]: (_campaign, _stopPropagation) => (
      <Link to={viewCampaignLink} onClick={(e) => e.stopPropagation()}>
        View Campaign
      </Link>
    ),
    [CampaignActionsEnum.Edit]: (campaign, _stopPropagation) => (
      <AntLink
        onClick={(e) => {
          e.stopPropagation();
          validateCampaignDetails(campaign?.id as string);
        }}>
        Edit Campaign
      </AntLink>
    ),
    [LineItemActionsEnum.Create]: (campaign, _stopPropagation) => (
      <AntLink
        onClick={(e) => {
          e.stopPropagation();
          validateCreateLineItemAction(campaign?.id as string);
        }}>
        Create Line Item
      </AntLink>
    ),
    [LineItemActionsEnum.View]: (_campaign, stopPropagation) => (
      <Link to={listOfLineItemLink} onClick={stopPropagation}>
        View Line Items
      </Link>
    ),
    [CampaignActionsEnum.Create]: (_campaign, _stopPropagation) => (
      <AntLink onClick={cloneCampaignAction}>Clone Campaign</AntLink>
    ),
  };

  const getDropdownMenus = (campaign: ICampaign) => {
    const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();

    const itemsConfig: ItemConfig[] = Object.entries(ACTION_MAPPING).map(
      ([key, render]) => ({
        key,
        permission: key as PermissionKeys,
        label: render!(campaign, stopPropagation),
      }),
    );

    const filteredMenu = itemsConfig
      .filter((item) => permissions[item.permission])
      .map(({ key, label }) => ({ key, label }));

    return filteredMenu;
  };

  return (
    <Dropdown
      menu={{ items: getDropdownMenus(campaign) }}
      placement='bottomLeft'>
      <Button
        onClick={(e) => e.stopPropagation()}
        icon={<ThreeDotsActionsIcon />}
        type='text'
        className='icon-only-button'
      />
    </Dropdown>
  );
};
