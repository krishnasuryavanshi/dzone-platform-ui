import { FC, useEffect, useState } from 'react';
// TODO: Import from leads module once migrated
// import { ILeadStatus } from '../../../leads/lib/types';
// import { fetchLeadValidationStatusList } from '../../../leads/services';
import { Button, Checkbox, Popover, Space, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {
  getDropdownLabelStyle,
  getDropdownBadgeStyle,
  getDropdownButtonStyle,
  dropdownIconStyle,
  dropdownSpaceStyle,
  dropdownLabelSpaceStyle,
} from '../../lib/utils/dropdown-styles';

interface IValidationStatusDropdownProps {
  onValidationStatusChange: (data: string[]) => void;
  selected: string[];
  isFileType: string;
}

export const ValidationStatusDropdown: FC<IValidationStatusDropdownProps> = ({
  onValidationStatusChange,
  selected,
  isFileType: _isFileType,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [validationStatusOptions, _setValidationStatusOptions] = useState<
    { value: string; text: string }[]
  >([]);

  useEffect(() => {
    fetchStatusData();
  }, []);

  const fetchStatusData = async () => {
    // TODO: Import from leads module once migrated
    // const data = await fetchLeadValidationStatusList();
    // if (data) {
    //   setValidationStatusOptions(
    //     data.data.map((item: ILeadStatus) => ({
    //       value: item.name,
    //       text: item.value,
    //     })),
    //   );
    // }
  };

  const hasSelected = selected && selected.length > 0;

  const labelStyle = getDropdownLabelStyle(hasSelected, true);
  const badgeStyle = getDropdownBadgeStyle(hasSelected);
  const buttonStyle = getDropdownButtonStyle({
    hasSelected,
    minWidth: '11rem',
  });

  const label = (
    <Space size={8} style={dropdownLabelSpaceStyle}>
      <Typography.Text style={labelStyle}>Validation Status</Typography.Text>
      {hasSelected && <span style={badgeStyle}>{selected.length}</span>}
    </Space>
  );

  const handleChange = (checkedValues: string[]) => {
    onValidationStatusChange(checkedValues);
  };

  const content = (
    <Checkbox.Group
      value={selected}
      onChange={handleChange as (checkedValues: (string | number | boolean)[]) => void}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {validationStatusOptions.map((option) => (
        <Checkbox key={option.value} value={option.value}>
          {option.text}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );

  return (
    <Popover
      content={content}
      trigger='click'
      placement='bottomLeft'>
      <Button style={buttonStyle}>
        <Space style={dropdownSpaceStyle}>
          {label}
          <DownOutlined style={dropdownIconStyle} />
        </Space>
      </Button>
    </Popover>
  );
};
