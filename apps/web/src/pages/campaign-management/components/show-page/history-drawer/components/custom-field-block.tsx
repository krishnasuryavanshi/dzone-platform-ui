import { FC } from 'react';
import { Typography, Flex } from 'antd';
import { RenderInputWithTooltip } from '../render-field-with-tooltip';

const { Text } = Typography;

interface CustomField {
  name?: string;
  label?: string;
  type?: string;
  format?: string | null;
  position?: number;
  required?: boolean;
  inclusion?: string;
  exclusion?: string;
}

interface CustomFieldBlockProps {
  oldFields: CustomField[];
  newFields: CustomField[];
}

interface FieldCardProps {
  field: CustomField | null;
  type: 'Old' | 'New';
}

const formatValue = (value: any): string => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

const FieldCard: FC<FieldCardProps> = ({ field, type }) => {
  if (!field) return <Text type="secondary">—</Text>;

  return (
    <Flex
      vertical
      gap={8}
      style={{ padding: '0.75rem', border: '1px solid #f0f0f0', borderRadius: '4px' }}
    >
      <Text type="secondary" style={{ fontSize: '0.875rem' }}>Position ({type}):</Text>
      <RenderInputWithTooltip value={formatValue(field.position)} tooltipTitle={formatValue(field.position)} />
      <Text type="secondary" style={{ fontSize: '0.875rem' }}>Name ({type}):</Text>
      <RenderInputWithTooltip value={formatValue(field.name)} tooltipTitle={formatValue(field.name)} />
      <Text type="secondary" style={{ fontSize: '0.875rem' }}>Label ({type}):</Text>
      <RenderInputWithTooltip value={formatValue(field.label)} tooltipTitle={formatValue(field.label)} />
      <Text type="secondary" style={{ fontSize: '0.875rem' }}>Type ({type}):</Text>
      <RenderInputWithTooltip value={formatValue(field.type)} tooltipTitle={formatValue(field.type)} />
      {field.type === 'Date' && (
        <>
          <Text type="secondary" style={{ fontSize: '0.875rem' }}>Format ({type}):</Text>
          <RenderInputWithTooltip value={formatValue(field.format)} tooltipTitle={formatValue(field.format)} />
        </>
      )}
      <Text type="secondary" style={{ fontSize: '0.875rem' }}>Required ({type}):</Text>
      <RenderInputWithTooltip value={formatValue(field.required)} tooltipTitle={formatValue(field.required)} />
      <Text type="secondary" style={{ fontSize: '0.875rem' }}>Inclusion ({type}):</Text>
      <RenderInputWithTooltip value={formatValue(field.inclusion)} tooltipTitle={formatValue(field.inclusion)} />
      <Text type="secondary" style={{ fontSize: '0.875rem' }}>Exclusion ({type}):</Text>
      <RenderInputWithTooltip value={formatValue(field.exclusion)} tooltipTitle={formatValue(field.exclusion)} />
    </Flex>
  );
};

export const CustomFieldBlock: FC<CustomFieldBlockProps> = ({ oldFields, newFields }) => {
  const maxLength = Math.max(oldFields?.length || 0, newFields?.length || 0);

  if (maxLength === 0) return <Text type="secondary">No custom fields</Text>;

  return (
    <Flex vertical gap={24} style={{ width: '100%', marginBottom: '2rem' }}>
      <Flex gap={16}>
        <Text type="secondary" style={{ fontSize: '0.875rem', width: '48%' }}>Custom Fields (Old)</Text>
        <Text type="secondary" style={{ fontSize: '0.875rem', width: '48%' }}>Custom Fields (New)</Text>
      </Flex>
      {Array.from({ length: maxLength }).map((_, i) => (
        <Flex key={i} gap={16} align="stretch">
          <Flex vertical style={{ width: '48%' }}>
            <FieldCard field={oldFields?.[i] || null} type="Old" />
          </Flex>
          <Flex vertical style={{ width: '48%' }}>
            <FieldCard field={newFields?.[i] || null} type="New" />
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
