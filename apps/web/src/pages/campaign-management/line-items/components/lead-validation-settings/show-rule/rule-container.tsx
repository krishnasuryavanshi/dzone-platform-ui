import { Hideable, MapFunction } from '@dzone/shared-ui';
import { Flex, Typography, notification } from 'antd';
import React, { PropsWithChildren, useState } from 'react';
import { usePermissionCheck } from '@dzone/shared-auth';
import { LineItemActionsEnum } from '@dzone/shared-lib';
import { useValidationSettingStore } from '../../../../../lead-validation/stores/use-validation-settings-store';
import {
  ValidationEditDrawer,
  EditConfig,
} from '../../edit-drawer/validation-edit-drawer';
import { EditOutlined } from '@ant-design/icons';
import { updateLineItemsLeadValidationSettingRule } from '../../../../../lead-validation/services';
import { CustomTooltip } from './show-targeting-attributes/custom-tooltip';

const { Text } = Typography;

interface RuleContainerProps extends PropsWithChildren {
  header: string;
  extra?: string[];
  ruleName: string;
  editComponent?: React.ReactNode;
  showEditButton?: boolean;
  editConfig?: EditConfig;
}

export const RuleContainer = ({
  header,
  extra = [],
  children,
  ruleName,
  showEditButton = true,
  editConfig = {},
}: RuleContainerProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeRuleName, setActiveRuleName] = useState('');
  const [copiedCount] = useState<number | null>(null);

  const canEditValidationSettings = usePermissionCheck(LineItemActionsEnum.EditValidationSettings);

  const { leadValidationSettingConfig, setActiveRule } =
    useValidationSettingStore();

  const handleEdit = () => {
    if (!leadValidationSettingConfig?.[ruleName]) {
      return;
    }

    setActiveRule(ruleName);
    setActiveRuleName(ruleName);

    const ruleConfig = leadValidationSettingConfig[ruleName];
    const { setSelectedValues } = useValidationSettingStore.getState();

    if (ruleConfig && ruleConfig.sections) {
      // Iterate through all sections of the rule
      ruleConfig.sections.forEach((section: any) => {
        const sectionData: Record<string, any> = {};

        if (section.attributes) {
          section.attributes.forEach((attr: any) => {
            // Check if the attribute has a value set to true or has complex value
            if (attr.value === true) {
              sectionData[attr.name] = true;
            } else if (attr.value && typeof attr.value === 'object') {
              // For complex values like in TARGETING rule
              sectionData[attr.name] = attr.value;
            } else if (
              attr.value !== false &&
              attr.value !== null &&
              attr.value !== undefined
            ) {
              // For other non-false values
              sectionData[attr.name] = attr.value;
            }
          });
        }
        setSelectedValues(section.name, sectionData);
      });
    }

    setEditedData({});

    setIsDrawerOpen(true);
  };

  const handleSave = async () => {
    // Get lineItemId and validationSettingsId from the validation settings store
    const { leadValidationSettingInfo } = useValidationSettingStore.getState();

    if (
      !leadValidationSettingInfo?.lineItemId ||
      !leadValidationSettingInfo?.leadValidationSettingId
    ) {
      return;
    }
    setIsLoading(true);
    try {
      if (!activeRuleName) {
        notification.error({
          message: 'No active rule selected',
        });
        return;
      }

      let dataToSave: any;
      let attributes: any[] = [];

      // Special handling for DUPLICATE_VALIDATION which has multiple sections
      if (activeRuleName === 'DUPLICATE_VALIDATION') {
        // Get the latest values from the store's selectedValues
        const { selectedValues: currentSelectedValues } =
          useValidationSettingStore.getState();
        const sections: Record<string, any[]> = {};

        // Process each section in the duplicate validation config
        const ruleSections =
          leadValidationSettingConfig?.[activeRuleName]?.sections || [];

        for (const section of ruleSections) {
          const sectionName = section.name;
          const sectionAttributes = section.attributes || [];

          if (sectionName === 'LOOPBACK_PERIOD') {
            // Handle numeric field - always include this section
            const sectionData = currentSelectedValues[sectionName] || {};
            const lookbackField = sectionAttributes[0];
            if (lookbackField) {
              const lookbackValue = sectionData[lookbackField.name];
              sections[sectionName] = [
                {
                  name: lookbackField.name,
                  value:
                    lookbackValue !== undefined &&
                    lookbackValue !== null &&
                    lookbackValue !== ''
                      ? lookbackValue
                      : null,
                },
              ];
            }
          } else {
            // Handle checkbox fields - always include section, even if no selected values
            const sectionData = currentSelectedValues[sectionName] || {};
            const processedAttributes = sectionAttributes.map((field: any) => ({
              name: field.name,
              value: sectionData[field.name] === true,
            }));

            // Always include the section
            sections[sectionName] = processedAttributes;
          }
        }

        const requestData = {
          rules: {
            [activeRuleName]: {
              selected: true,
              sections: sections,
            },
          },
        };

        await updateLineItemsLeadValidationSettingRule(
          leadValidationSettingInfo.lineItemId,
          leadValidationSettingInfo.leadValidationSettingId,
          ruleName,
          requestData,
        );

        notification.success({
          message: 'Validation settings updated successfully',
        });

        // Refresh the validation settings data
        const { fetchConfiguration } = useValidationSettingStore.getState();
        await fetchConfiguration();

        setIsDrawerOpen(false);
        setIsLoading(false);
        return; // Exit early
      }
      // Handle other checkbox-based validations
      else if (
        [
          'MANDATORY_VALIDATION',
          'SYNTAX_VALIDATION',
          'INTEGRITY_VALIDATION',
        ].includes(activeRuleName)
      ) {
        // Get the actual section name from config (e.g., MANDATORY_FIELDS)
        const sectionName =
          leadValidationSettingConfig?.[activeRuleName]?.sections?.[0]?.name;

        // Get the latest values from the store's selectedValues for this section
        // The ValidationRuleCheckboxGroup updates selectedValues[sectionName]
        const { selectedValues: currentSelectedValues } =
          useValidationSettingStore.getState();
        dataToSave = currentSelectedValues[sectionName] || {};

        // Get all possible fields from the config
        const allFields =
          leadValidationSettingConfig?.[activeRuleName]?.sections?.[0]
            ?.attributes || [];

        attributes = allFields.map((field: any) => ({
          name: field.name,
          value: dataToSave[field.name] === true, // Ensure false is sent if not true
        }));

        // Update the request data structure to use the actual section name
        const requestData = {
          rules: {
            [activeRuleName]: {
              selected: true,
              sections: {
                [sectionName || activeRuleName]: attributes,
              },
            },
          },
        };

        await updateLineItemsLeadValidationSettingRule(
          leadValidationSettingInfo.lineItemId,
          leadValidationSettingInfo.leadValidationSettingId,
          ruleName,
          requestData,
        );

        notification.success({
          message: 'Validation settings updated successfully',
        });

        // Refresh the validation settings data
        const { fetchConfiguration } = useValidationSettingStore.getState();
        await fetchConfiguration();

        setIsDrawerOpen(false);
        setIsLoading(false);
        return; // Exit early for these rule types
      }
      // For rules with radio selections (EMAIL_VALIDATION, TARGETING_VALIDATION, OPT_IN_VALIDATION)
      else if (
        [
          'EMAIL_VALIDATION',
          'TARGETING_VALIDATION',
          'OPT_IN_VALIDATION',
        ].includes(activeRuleName)
      ) {
        // Get the section name and values from store
        const { selectedValues: currentSelectedValues } =
          useValidationSettingStore.getState();
        const sectionName =
          leadValidationSettingConfig?.[activeRuleName]?.sections?.[0]?.name;
        dataToSave = currentSelectedValues[sectionName || activeRuleName] || {};

        // These typically have a single selected value
        attributes = Object.entries(dataToSave).map(([key, value]) => ({
          name: key,
          value: value,
        }));
      }
      // Default handler for other rule types
      else {
        // Get the section name and values from store
        const { selectedValues: currentSelectedValues } =
          useValidationSettingStore.getState();
        const sectionName =
          leadValidationSettingConfig?.[activeRuleName]?.sections?.[0]?.name;
        dataToSave = currentSelectedValues[sectionName || activeRuleName] || {};

        attributes = Object.entries(dataToSave).map(([key, value]) => ({
          name: key,
          value: value,
        }));
      }

      const requestData = {
        rules: {
          [activeRuleName]: {
            selected: true,
            sections: {
              [activeRuleName]: attributes,
            },
          },
        },
      };
      await updateLineItemsLeadValidationSettingRule(
        leadValidationSettingInfo.lineItemId,
        leadValidationSettingInfo.leadValidationSettingId,
        ruleName,
        requestData,
      );

      notification.success({
        message: 'Validation settings updated successfully',
      });

      // Refresh the validation settings data
      const { fetchConfiguration } = useValidationSettingStore.getState();
      await fetchConfiguration();

      setIsDrawerOpen(false);
    } catch (error) {
      notification.error({
        message: 'Failed to update validation settings',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsDrawerOpen(false);
    setEditedData({});
    setActiveRule('');
    setActiveRuleName('');
  };

  const renderExtraContent = (item: string) => (
    <Flex
      style={{
        background: '#EAF1FF',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
      }}>
      <Text
        style={{
          color: '#235AED',
          fontSize: '0.75rem',
          fontWeight: 600,
          lineHeight: '1rem',
        }}>
        {item}
      </Text>
    </Flex>
  );

  return (
    <>
      <Flex
        vertical
        style={{
          backgroundColor: '#FFFFFF',
          border: ruleName !== 'TARGETING' ? '1px solid #E5E7EB' : 'none',
          borderRadius: ruleName !== 'TARGETING' ? '8px' : 'none',
          position: 'relative',
        }}>
        {/* Header Section - Hidden for TARGETING as it has its own section header */}
        {ruleName !== 'TARGETING' && (
          <Flex
            vertical
            style={{
              padding: '0.75rem 1rem',
              borderBottom: children ? '1px solid #E5E7EB' : 'none',
            }}>
            <Flex justify='space-between' align='center'>
              <Flex align='center' gap={'0.5rem'}>
                <Text
                  style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    lineHeight: '1.25rem',
                  }}>
                  {header}
                </Text>
                <Hideable show={extra?.length > 0}>
                  <Flex gap={'0.375rem'}>
                    <MapFunction
                      items={extra}
                      renderItem={renderExtraContent}
                    />
                  </Flex>
                </Hideable>
              </Flex>
              <Flex gap='0.5rem' align='center'>
                {copiedCount !== null && (
                  <Text style={{ fontSize: '0.75rem', color: '#34C759' }}>
                    {copiedCount} records copied!
                  </Text>
                )}
                {showEditButton && canEditValidationSettings && (
                  <CustomTooltip title='Edit'>
                    <Flex
                      style={{
                        backgroundColor: '#fff',
                        borderRadius: '5px',
                        padding: '0.25rem 0.5rem',
                        border: '1px solid #ddd',
                        cursor: 'pointer',
                      }}
                      onClick={handleEdit}>
                      <EditOutlined />
                    </Flex>
                  </CustomTooltip>
                )}
              </Flex>
            </Flex>
          </Flex>
        )}

        {/* Edit button for TARGETING - positioned absolutely in top right */}
        {ruleName === 'TARGETING' && showEditButton && canEditValidationSettings && (
          <Flex
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              zIndex: 1,
            }}>
            <CustomTooltip title='Edit'>
              <Flex
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '5px',
                  padding: '0.25rem 0.5rem',
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                }}
                onClick={handleEdit}>
                <EditOutlined />
              </Flex>
            </CustomTooltip>
          </Flex>
        )}

        {/* Content Section */}
        <Hideable show={!!children}>
          <Flex
            vertical
            style={{
              padding: ruleName !== 'TARGETING' ? '0.75rem 1rem' : '0',
            }}>
            {children}
          </Flex>
        </Hideable>
      </Flex>

      <ValidationEditDrawer
        isOpen={isDrawerOpen}
        onClose={handleClose}
        title={header}
        isLoading={isLoading}
        onSave={handleSave}
        ruleName={activeRuleName}
        editConfig={editConfig}
        editedData={editedData}
        setEditedData={setEditedData}
      />
    </>
  );
};
