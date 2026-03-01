import { FC } from 'react';
import { Typography, Flex } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { FileField } from './file-field';
import { CustomQuestionBlock } from './custom-question-block';
import { CustomFieldBlock } from './custom-field-block';
import { ValueDisplay } from './value-display';

const { Text } = Typography;

interface DiffRendererProps {
  diff: any[];
  updatedBy: string;
  timestamp: string;
  fileMap: Record<string, any>;
  validationSettingMap: Record<string, string>;
}

export const DiffRenderer: FC<DiffRendererProps> = ({
  diff,
  updatedBy,
  timestamp,
  fileMap,
  validationSettingMap,
}) => {
  if (!diff || diff.length === 0) return <Text type="secondary">No changes</Text>;

  const getListTypeLabel = (value: any, defaultLabel: string): string => {
    if (value && typeof value === 'object' && 'isInclusion' in value) {
      return value.isInclusion ? `Inclusion List (${defaultLabel})` : `Suppression List (${defaultLabel})`;
    }
    return defaultLabel;
  };

  const isListRelatedField = (name: string): boolean => {
    if (!name) return false;
    const n = name.toLowerCase();
    return n.includes('suppression') || n.includes('inclusion') || n.includes('domain') || n.includes('company') || n.includes('email');
  };

  const isJobTitleField = (name: string): boolean => name?.toLowerCase().includes('jobtitle') ?? false;

  const isFileWithInclusion = (val: any): boolean =>
    val && typeof val === 'object' && 'value' in val && 'isInclusion' in val && (Array.isArray(val.value) || typeof val.value === 'string');

  const renderFromTo = (from: any, to: any, fromLabel: string, toLabel: string, fieldName?: string) => (
    <Flex gap={16} style={{ marginBottom: '2rem' }}>
      <Flex vertical style={{ width: '48%' }}>
        <Text type="secondary" style={{ fontSize: '0.875rem' }}>{fromLabel}</Text>
        <ValueDisplay value={from} fieldName={fieldName} validationSettingMap={validationSettingMap} />
      </Flex>
      <Flex vertical style={{ width: '48%' }}>
        <Text type="secondary" style={{ fontSize: '0.875rem' }}>{toLabel}</Text>
        <ValueDisplay value={to} fieldName={fieldName} validationSettingMap={validationSettingMap} />
      </Flex>
    </Flex>
  );

  return (
    <Flex vertical gap={12}>
      {diff.map((item: any, index: number) => {
        if (item.name === 'customFields') item.label = 'Custom Fields';
        if (item.name === 'customFieldInstructions') item.label = 'Custom Field Instructions';

        const headingRow = (
          <Flex justify="space-between" align="center" style={{ marginBottom: '0.8rem' }}>
            <Flex vertical>
              <Text strong style={{ fontSize: '1rem' }}>{item.label || item.name}</Text>
              <Text type="secondary" style={{ fontSize: '0.875rem' }}>Changed By: {updatedBy}</Text>
            </Flex>
            <Flex vertical align="end">
              <Text type="secondary" style={{ fontSize: '0.875rem' }}>{dayjs.utc(timestamp).fromNow()}</Text>
              <Text type="secondary" style={{ fontSize: '0.875rem', display: 'flex', gap: '0.2rem' }}>
                <CalendarOutlined />
                {dayjs.utc(timestamp).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('YYYY-MM-DD, hh:mm A')}
              </Text>
            </Flex>
          </Flex>
        );

        if (item.name === 'lineItem.validationSettingsId') {
          return <Flex key={index} vertical>{headingRow}{renderFromTo(item.from, item.to, 'Previous Value', 'New Value', item.name)}</Flex>;
        }

        if (isJobTitleField(item.name)) {
          return (
            <Flex vertical key={index}>
              {headingRow}
              <Flex gap={16} style={{ marginBottom: '2rem' }}>
                <Flex vertical style={{ width: '48%' }}>
                  <Text type="secondary" style={{ fontSize: '0.875rem' }}>Previous Value</Text>
                  {isFileWithInclusion(item.from) ? <FileField fileIds={item.from} fileMap={fileMap} /> : <ValueDisplay value={item.from} fieldName={item.name} />}
                </Flex>
                <Flex vertical style={{ width: '48%' }}>
                  <Text type="secondary" style={{ fontSize: '0.875rem' }}>New Value</Text>
                  {isFileWithInclusion(item.to) ? <FileField fileIds={item.to} fileMap={fileMap} /> : <ValueDisplay value={item.to} fieldName={item.name} />}
                </Flex>
              </Flex>
            </Flex>
          );
        }

        if (item.type === 'File' || (isListRelatedField(item.name) && (isFileWithInclusion(item.from) || isFileWithInclusion(item.to)))) {
          return (
            <Flex vertical key={index}>
              {headingRow}
              <Flex gap={16} style={{ marginBottom: '2rem' }}>
                <Flex vertical style={{ width: '48%' }}>
                  <Text type="secondary" style={{ fontSize: '0.875rem' }}>{getListTypeLabel(item.from, 'Previous Value')}</Text>
                  <FileField fileIds={item.from} fileMap={fileMap} />
                </Flex>
                <Flex vertical style={{ width: '48%' }}>
                  <Text type="secondary" style={{ fontSize: '0.875rem' }}>{getListTypeLabel(item.to, 'New Value')}</Text>
                  <FileField fileIds={item.to} fileMap={fileMap} />
                </Flex>
              </Flex>
            </Flex>
          );
        }

        if (item.name === 'customQuestions') {
          return (
            <Flex key={index} vertical>
              {headingRow}
              <CustomQuestionBlock oldQuestions={Array.isArray(item.from) ? item.from : []} newQuestions={Array.isArray(item.to) ? item.to : []} />
            </Flex>
          );
        }

        if (item.name === 'customFields') {
          return (
            <Flex key={index} vertical>
              {headingRow}
              <CustomFieldBlock oldFields={Array.isArray(item.from) ? item.from : []} newFields={Array.isArray(item.to) ? item.to : []} />
            </Flex>
          );
        }

        switch (item.type) {
          case 'Fields': case 'Radio': case 'checkbox': case 'dropdown': case 'Toggle': case 'Array': case 'Text': case 'Number':
            return (
              <Flex key={index} vertical>
                {headingRow}
                {renderFromTo(
                  item.from, item.to,
                  isListRelatedField(item.name) ? getListTypeLabel(item.from, 'Previous Value') : 'Previous Value',
                  isListRelatedField(item.name) ? getListTypeLabel(item.to, 'New Value') : 'New Value',
                  item.name,
                )}
              </Flex>
            );
          default:
            if (item.level && Array.isArray(item.level)) {
              return (
                <Flex key={index} vertical>
                  {headingRow}
                  <Flex vertical gap={8} style={{ marginBottom: '2rem' }}>
                    {item.level.map((lvl: any, lvlIdx: number) => (
                      <Flex justify="space-between" key={lvlIdx} wrap="wrap" gap={12}>
                        <Flex vertical style={{ width: '48%' }}>
                          <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                            {isListRelatedField(lvl.type) && isFileWithInclusion(lvl.from)
                              ? getListTypeLabel(lvl.from, `${lvl.type} (Previous)`)
                              : `${lvl.type} (Previous)`}
                          </Text>
                          {isJobTitleField(lvl.type) && lvl.from ? <FileField fileIds={lvl.from} fileMap={fileMap} />
                            : isListRelatedField(lvl.type) && isFileWithInclusion(lvl.from) ? <FileField fileIds={lvl.from} fileMap={fileMap} />
                            : <ValueDisplay value={lvl.from} fieldName={lvl.type} />}
                        </Flex>
                        <Flex vertical style={{ width: '48%' }}>
                          <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                            {isListRelatedField(lvl.type) && isFileWithInclusion(lvl.to)
                              ? getListTypeLabel(lvl.to, `${lvl.type} (New)`)
                              : `${lvl.type} (New)`}
                          </Text>
                          {isJobTitleField(lvl.type) && lvl.to ? <FileField fileIds={lvl.to} fileMap={fileMap} />
                            : isListRelatedField(lvl.type) && isFileWithInclusion(lvl.to) ? <FileField fileIds={lvl.to} fileMap={fileMap} />
                            : <ValueDisplay value={lvl.to} fieldName={lvl.type} />}
                        </Flex>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>
              );
            }
            return null;
        }
      })}
    </Flex>
  );
};
