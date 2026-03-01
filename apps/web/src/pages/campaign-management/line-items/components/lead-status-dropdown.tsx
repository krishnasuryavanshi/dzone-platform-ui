import { DzCheckboxDropdown, DzSelectDropdown } from '@dzone/shared-ui';
import { FC, useEffect, useState } from 'react';
import { Button, Space, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { ILeadStatus } from '../../leads/lib/types';
import { fetchLeadStatusList } from '../../leads/services';
import { LeadStatusFileType } from '../lib/enums';
import {
  getDropdownLabelStyle,
  getDropdownBadgeStyle,
  getDropdownButtonStyle,
  dropdownIconStyle,
  dropdownSpaceStyle,
  dropdownLabelSpaceStyle,
} from '../lib/utils/dropdown-styles';

const { Text } = Typography;

interface ILeadStatusDropdownProps {
  onLeadsStatusChange: (data: string[]) => void;
  selected: string[];
  isFileType: string;
}
export const LeadStatusDropdown: FC<ILeadStatusDropdownProps> = ({
  onLeadsStatusChange,
  selected,
  isFileType,
}) => {
  const [leadsStatusOptions, setLeadsStatusOptions] = useState<
    { value: string; text: string }[]
  >([]);

  useEffect(() => {
    fetchStatusData();
  }, []);

  const fetchStatusData = async () => {
    const data = await fetchLeadStatusList();
    if (data) {
      const leadStatusOptionsList = data?.data?.map((item: ILeadStatus) => ({
        value: item.name,
        text: item.value,
      }));
      setLeadsStatusOptions(leadStatusOptionsList);
    }
  };

  const DropdownComponent =
    isFileType === LeadStatusFileType.Leads
      ? DzCheckboxDropdown
      : DzSelectDropdown;

  const hasSelected = selected && selected.length > 0;

  const labelStyle = getDropdownLabelStyle(hasSelected, true);
  const badgeStyle = getDropdownBadgeStyle(hasSelected);
  const buttonStyle = getDropdownButtonStyle({
    hasSelected,
    minWidth: '10rem',
  });

  const label = (
    <Space size={8} style={dropdownLabelSpaceStyle}>
      <Text style={labelStyle}>Lead Status</Text>
      {hasSelected && <span style={badgeStyle}>{selected.length}</span>}
    </Space>
  );

  // Render custom button for dropdown
  const CustomButton = ({ onClick }: { onClick: (e: any) => void }) => (
    <Button style={buttonStyle} onClick={onClick}>
      <Space style={dropdownSpaceStyle}>
        {label}
        <DownOutlined style={dropdownIconStyle} />
      </Space>
    </Button>
  );

  return (
    <DropdownComponent
      label={label}
      options={leadsStatusOptions}
      onApply={onLeadsStatusChange}
      onReset={onLeadsStatusChange}
      selected={selected}
      isFileType={isFileType}
      renderButton={CustomButton}
      instantFilter={true}
    />
  );
};
