import { type FC, type SyntheticEvent } from 'react';
import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Link } from 'react-router';
import { ThreeDotsActionsIcon } from '@dzone/shared-ui';
import type { IExcecutiveGrids } from '../../../../lib/types';

interface ExecutiveGridActionsProps {
  executive: IExcecutiveGrids;
}

export const ExecutiveGridActions: FC<ExecutiveGridActionsProps> = ({
  executive,
}) => {
  const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();
  const baseLink = `/campaign-management/clients/${executive.clientUUID}/campaigns/${executive.campaignUUID}`;

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link to={baseLink} onClick={stopPropagation}>
          View Campaign
        </Link>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <Button
        onClick={(e) => e.stopPropagation()}
        icon={<ThreeDotsActionsIcon />}
        type="text"
      />
    </Dropdown>
  );
};
