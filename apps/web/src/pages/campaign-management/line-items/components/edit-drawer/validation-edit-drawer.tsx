import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Drawer, Flex, Typography } from 'antd';
import { MapFunction } from '@dzone/shared-ui';
import { FileManager } from './file-manager';
import styles from './validation-edit-drawer.module.css';
import type { FileItemType } from './file-manager';
import { ValidationSettingRuleSection } from '../../../../lead-validation/components/validations/validation-setting-rule-section';
import { ChipsEdit } from './chips-edit';
import { ListSelectionEdit } from './list-selection-edit';
import { useValidationSettingStore } from '../../../../lead-validation/stores/use-validation-settings-store';

const { Text } = Typography;

export interface EditConfig {
  type?: string;
  options?: any;
  fields?: any[];
  props?: any;
  fileMetaTypeName?: string | null;
}

interface ValidationEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSave: () => void;
  isLoading?: boolean;
  ruleName?: string;
  editConfig?: EditConfig;
  editedData: any;
  setEditedData: (data: any) => void;
  children?: ReactNode;
}

export const ValidationEditDrawer: React.FC<ValidationEditDrawerProps> = ({
  isOpen,
  onClose,
  title,
  onSave,
  isLoading = false,
  ruleName,
  editConfig = {},
  editedData,
  setEditedData,
  children,
}) => {
  const { getValidationSettingRuleSections, activeRule } =
    useValidationSettingStore();
  const [ruleSections, setRuleSections] = useState<Record<string, any>[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeRule) {
      const sections = getValidationSettingRuleSections();
      setRuleSections(sections);
    } else {
      setRuleSections([]);
    }
  }, [activeRule, getValidationSettingRuleSections]);

  const handleSelectionChange = (
    fileData: Array<{ id: string; isDisabled: boolean }>,
  ) => {
    const updatedFiles = (editedData.files || []).map((file: FileItemType) => {
      const selectedItem = fileData.find((item) => item.id === file.id);
      if (selectedItem) {
        return { ...file, isDisabled: selectedItem.isDisabled };
      }
      return file;
    });

    setEditedData({ ...editedData, files: updatedFiles });
  };

  const renderEditor = () => {
    const validationTypeFromConfig = editConfig.type;
    const ruleKey = ruleName ? ruleName : validationTypeFromConfig;

    let fileMetaType: string | null = null;
    if (ruleKey === 'files') {
      for (const section of getValidationSettingRuleSections()) {
        const attribute = section.attributes?.find(
          (attr: any) => attr.name === editConfig.props?.attributeName,
        );
        if (attribute?.fileMetadataType) {
          fileMetaType =
            attribute.fileMetadataType.inclusion ||
            attribute.fileMetadataType.exclusion ||
            attribute.fileMetadataType;
          break;
        }
      }
      if (!fileMetaType && editConfig.props?.fileMetadataTypeName) {
        fileMetaType = editConfig.props.fileMetadataTypeName;
      }
    }
    switch (ruleKey) {
      case 'files':
        return (
          <FileManager
            inline={true}
            isOpen={true}
            onClose={onClose}
            title={title}
            files={editedData || []}
            onFilesChange={(files) => setEditedData(files)}
            onSave={onSave}
            allowUpload={editConfig.props?.allowUpload ?? true}
            allowDelete={editConfig.props?.allowDelete ?? true}
            acceptedFileTypes={
              editConfig.props?.acceptedFileTypes || ['.csv', '.xlsx', '.txt']
            }
            onSelectionChange={handleSelectionChange}
            fileMetadataTypeName={editConfig.fileMetaTypeName}
            {...(editConfig.props || {})}
          />
        );

      case 'chips':
        return (
          <ChipsEdit
            values={editedData.selectedValues || []}
            onChange={(chips) =>
              setEditedData({ ...editedData, selectedValues: chips })
            }
            label={title}
            placeholder={editConfig.props?.placeholder || 'Add New'}
          />
        );
      case 'list-selection':
        return (
          <ListSelectionEdit
            values={editedData.selectedValues || []}
            onChange={(newValues) =>
              setEditedData({ ...editedData, selectedValues: newValues })
            }
            predefinedOptions={editConfig.props?.predefinedOptions || []}
            showSearch={editConfig.props?.showSearch}
            allowCustomRange={editConfig.props?.allowCustomRange}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />
        );
      case 'custom':
        return (
          children || (
            <Flex style={{ padding: '1rem', textAlign: 'center' }}>
              <Text>Custom edit component needed</Text>
            </Flex>
          )
        );

      default:
        if (!ruleKey) return null;
        return (
          <MapFunction
            items={ruleSections}
            renderItem={(section: Record<string, any>, index: number) => (
              <ValidationSettingRuleSection
                name={section.name}
                key={index}
                noBorder={
                  section.name === 'LOOPBACK_PERIOD' || section.noBorder
                }
              />
            )}
          />
        );
    }
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title={title}
      width={500}
      rootClassName={styles.blueHeader}
      styles={{
        body: {
          border: '1px solid #D3E3EE',
          margin: '1.5rem',
          borderRadius: '4px',
          padding: '1rem',
        },
      }}
      footer={
        <Flex
          gap='0.75rem'
          justify='flex-end'
          style={{ padding: '1rem 1.5rem' }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type='primary' onClick={onSave} loading={isLoading}>
            Save
          </Button>
        </Flex>
      }>
      <Flex vertical>{renderEditor()}</Flex>
    </Drawer>
  );
};
