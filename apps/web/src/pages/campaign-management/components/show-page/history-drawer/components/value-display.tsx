import { FC } from 'react';
import { Typography, Flex } from 'antd';
import { RenderInputWithTooltip } from '../render-field-with-tooltip';

const { Text } = Typography;

interface ValueDisplayProps {
  value: any;
  fieldName?: string;
  showInclusionLabel?: boolean;
  maxLength?: number;
  validationSettingMap?: Record<string, string>;
}

export const ValueDisplay: FC<ValueDisplayProps> = ({
  value,
  fieldName,
  showInclusionLabel = false,
  maxLength = 100,
  validationSettingMap = {},
}) => {
  if (value === null || value === undefined) {
    return <Text type="secondary">—</Text>;
  }

  const isJobTitle = fieldName?.toLowerCase().includes('jobtitle');
  const isStatus = fieldName?.toLowerCase() === 'status';
  const isValidationSetting = fieldName === 'lineItem.validationSettingsId';

  const truncateWithEllipsis = (text: string): string => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatValue = (val: any, shouldTruncate: boolean = true): string => {
    if (val === null || val === undefined) return '—';

    if (isValidationSetting && typeof val === 'string' && validationSettingMap[val]) {
      return validationSettingMap[val];
    }

    if (typeof val === 'object' && val !== null) {
      if (Array.isArray(val)) {
        const joinedValue = val
          .map((item) => (item === null || item === undefined ? '—' : String(item)))
          .join(', ');
        return shouldTruncate ? truncateWithEllipsis(joinedValue) : joinedValue;
      }
      if (isJobTitle && 'value' in val && !('isInclusion' in val)) {
        if (Array.isArray(val.value)) {
          const joinedValue = val.value.join(', ');
          return shouldTruncate ? truncateWithEllipsis(joinedValue) : joinedValue;
        }
        const stringValue = String(val.value);
        return shouldTruncate ? truncateWithEllipsis(stringValue) : stringValue;
      }
      if (isJobTitle && 'value' in val && 'isInclusion' in val) return '[File Reference]';
      if ('value' in val && 'isInclusion' in val && !showInclusionLabel) {
        if (Array.isArray(val.value)) {
          const joinedValue = val.value.join(', ');
          return shouldTruncate ? truncateWithEllipsis(joinedValue) : joinedValue;
        }
        const stringValue = String(val.value);
        return shouldTruncate ? truncateWithEllipsis(stringValue) : stringValue;
      }
      if ('value' in val && !('isInclusion' in val)) return formatValue(val.value, shouldTruncate);
      try {
        const jsonString = JSON.stringify(val);
        return shouldTruncate ? truncateWithEllipsis(jsonString) : jsonString;
      } catch {
        return '[Complex Object]';
      }
    }

    const stringValue = String(val);
    return shouldTruncate ? truncateWithEllipsis(stringValue) : stringValue;
  };

  const formatStatusField = (val: any): string => {
    if (typeof val === 'object' && val !== null && 'value' in val) return String(val.value);
    return String(val);
  };

  const fullValue = isStatus ? formatStatusField(value) : formatValue(value, false);
  const displayValue = isStatus
    ? truncateWithEllipsis(formatStatusField(value))
    : formatValue(value, true);

  return (
    <Flex style={{ width: '100%' }}>
      <RenderInputWithTooltip
        value={displayValue}
        tooltipTitle={fullValue}
        style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
      />
    </Flex>
  );
};
