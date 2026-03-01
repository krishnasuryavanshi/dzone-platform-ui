import { Button, Dropdown, Space, Typography } from 'antd';
import { ThreeDotsActionsIcon } from '@dzone/shared-ui';
import React, { FC, SyntheticEvent, useState } from 'react';
import { usePermissionCheck } from '@dzone/shared-auth';
import { LeadActionsEnum, LineItemActionsEnum } from '@dzone/shared-lib';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import { notification } from 'antd';

import './record-actions.css';
import { validateLineItem } from '../services';
import { useLineItemStore } from '../stores';
import { CloneLineItemModal } from './clone-line-item';

const { Link: AntLink } = Typography;

interface IRecordActionsProps {
  lineItemId: string;
  campaignId: string;
  tenantCode?: string;
  marketerCode?: string;
}

type PermissionKeys = `${LineItemActionsEnum}` | `${LeadActionsEnum}`;

type ItemConfig = {
  key: string;
  permission: PermissionKeys;
  label: React.ReactNode;
};

export const LineItemRecordActions: FC<IRecordActionsProps> = ({
  lineItemId,
  campaignId,
  tenantCode,
  marketerCode,
}) => {
  const { showLoader } = useLineItemStore();

  const navigate = useNavigate();

  const permissions: Partial<Record<PermissionKeys, boolean>> = {
    [LineItemActionsEnum.View]: usePermissionCheck(LineItemActionsEnum.View),
    [LineItemActionsEnum.Edit]: usePermissionCheck(LineItemActionsEnum.Edit),
    [LeadActionsEnum.View]: usePermissionCheck(LeadActionsEnum.View),
    [LineItemActionsEnum.Create]: usePermissionCheck(
      LineItemActionsEnum.Create,
    ),
  };

  const [openModal, setOpenModal] = useState<boolean>(false);

  const closeModal = () => {
    setOpenModal(false);
  };

  const cloneLineItemAction = (e: SyntheticEvent) => {
    e.stopPropagation();
    setOpenModal(true);
  };

  const LineItemLink = `/campaign-management/line-items/${lineItemId}`;
  const editLineItemLink = `${LineItemLink}/edit`;

  const validateLineItemDetails = async (lineItemId: string) => {
    showLoader(true);
    try {
      const data = await validateLineItem(lineItemId);
      if (data?.data) {
        navigate(editLineItemLink);
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
        lineItemId: string,
        tenantCode: string,
        stopPropagation: (e: SyntheticEvent) => void,
      ) => React.ReactNode
    >
  > = {
    [LineItemActionsEnum.View]: (_lineItemId, _stopPropagation) => (
      <Link to={LineItemLink}>View Line Item</Link>
    ),
    [LineItemActionsEnum.Edit]: (lineItemId, _stopPropagation) => (
      <AntLink
        onClick={(e) => {
          e.stopPropagation();
          validateLineItemDetails(lineItemId as string);
        }}>
        Edit Line Item
      </AntLink>
    ),
    [LeadActionsEnum.View]: (lineItemId, _stopPropagation) => (
      <Link
        to={`/campaign-management/leads?lineItemId=${lineItemId}&tenantCode=${tenantCode}`}>
        View Leads
      </Link>
    ),
    [LineItemActionsEnum.Create]: (_lineItemId, _stopPropagation) => (
      <AntLink onClick={cloneLineItemAction}>Clone Line Item</AntLink>
    ),
  };

  const getDropdownMenus = (lineItemId: string) => {
    const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();

    const itemsConfig: ItemConfig[] = Object.entries(ACTION_MAPPING).map(
      ([key, render]) => ({
        key,
        permission: key as PermissionKeys,
        label: render(lineItemId, tenantCode ?? '', stopPropagation),
      }),
    );

    const filteredMenu = itemsConfig
      .filter((item) => permissions[item.permission])
      .map(({ key, label }) => ({ key, label }));

    return filteredMenu;
  };

  const handleModalClick = (e: SyntheticEvent) => {
    e.stopPropagation(); // Prevent click from closing the modal if clicking inside the modal
  };

  return (
    <>
      <Dropdown
        menu={{ items: getDropdownMenus(lineItemId) }}
        placement='bottomLeft'>
        <Button
          onClick={(e) => e.stopPropagation()}
          icon={<ThreeDotsActionsIcon />}
          type='text'
          className='icon-only-button'
        />
      </Dropdown>
      <Space onClick={handleModalClick}>
        <CloneLineItemModal
          lineItemId={lineItemId}
          campaignId={campaignId}
          editLineItemLink={editLineItemLink}
          openModal={openModal}
          closeModal={closeModal}
          marketerCode={marketerCode}
        />
      </Space>
    </>
  );
};
