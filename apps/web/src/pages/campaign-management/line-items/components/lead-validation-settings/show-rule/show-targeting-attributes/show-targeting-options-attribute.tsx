import { Flex, Typography, notification } from 'antd';
import { EyeOutlined, EditOutlined, CopyOutlined } from '@ant-design/icons';
import { usePermissionCheck } from '@dzone/shared-auth';
import { LineItemActionsEnum } from '@dzone/shared-lib';
import { useState, useEffect } from 'react';
import { DrawerShowList } from '../../../../../components/show-page/drawer-show-list';
import { ValidationEditDrawer } from '../../../edit-drawer/validation-edit-drawer';
import { updateLineItemsLeadValidationSettingAttribute } from '../../../../../../lead-validation/services';
import { useValidationSettingStore } from '../../../../../../lead-validation/stores/use-validation-settings-store';
import { CustomTooltip } from './custom-tooltip';
import { TruncatedTagList } from '../components/truncated-tag-list';

const { Text } = Typography;

type ShowTargetingOptionsAttributeProps = {
  name: string;
  label: string;
  options: Record<string, any>[];
  values: string[];
  attributeId: string;
  onUpdate?: (newValues: string[]) => void;
  isEditing?: boolean;
};

export const ShowTargetingOptionsAttribute = ({
  name,
  label,
  options,
  values,
  attributeId,
  onUpdate,
  isEditing = false,
}: ShowTargetingOptionsAttributeProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<any>({ selectedValues: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCount, setCopiedCount] = useState<number | null>(null);
  const [currentValues, setCurrentValues] = useState<string[]>(values);

  const canEditValidationSettings = usePermissionCheck(LineItemActionsEnum.EditValidationSettings);
  const canViewValidationSettings = usePermissionCheck(LineItemActionsEnum.ViewValidationSettings);

  const getEditConfig = (attributeName: string) => {
    const isRevenueOrEmployee = ['revenueSize', 'employeeSize'].includes(
      attributeName,
    );
    const isCountry = attributeName === 'country';

    const editorOptions = options.map((option) => ({
      id: option.value,
      label: option.label || option.value,
    }));

    if (isRevenueOrEmployee || isCountry) {
      return {
        type: 'list-selection',
        props: {
          predefinedOptions: editorOptions,
          showSearch: isCountry,
          allowCustomRange: isRevenueOrEmployee,
        },
      };
    }

    return {
      type: 'chips',
      props: {
        predefinedOptions: editorOptions,
      },
    };
  };

  const editConfig = getEditConfig(name);

  useEffect(() => {
    setCurrentValues(values);
  }, [values]);

  // Initialize editedData only when component mounts or when values change from parent
  useEffect(() => {
    // Only update if drawer is not open (to preserve user's unsaved changes)
    if (!isEditDrawerOpen) {
      let selectedValuesForEditor;

      if (editConfig.type === 'list-selection') {
        // ListSelectionEdit expects a flat array of strings (the values)
        selectedValuesForEditor = currentValues;
      } else {
        // ChipsEdit expects an array of {id, label} objects
        selectedValuesForEditor = currentValues.map((value) => {
          const option = options.find((opt) => opt.value === value);
          return {
            id: value,
            label: option ? option.label : value,
          };
        });
      }

      setEditedData({
        selectedValues: selectedValuesForEditor,
      });
    }
  }, [options, currentValues, editConfig.type, isEditDrawerOpen]);

  const handleEdit = () => {
    setIsEditDrawerOpen(true);
  };

  const handleClose = () => {
    setIsEditDrawerOpen(false);
    // Reset edited data to original values when closing without saving
    let selectedValuesForEditor;
    if (editConfig.type === 'list-selection') {
      selectedValuesForEditor = currentValues;
    } else {
      selectedValuesForEditor = currentValues.map((value) => {
        const option = options.find((opt) => opt.value === value);
        return {
          id: value,
          label: option ? option.label : value,
        };
      });
    }
    setEditedData({
      selectedValues: selectedValuesForEditor,
    });
  };

  const handleCopy = () => {
    const dataToCopy = editedData;
    if (!dataToCopy) {
      notification.info({
        message: 'No data to copy.',
      });
      return;
    }

    if (currentValues.length === 0) {
      notification.info({
        message: 'No values to copy.',
      });
      return;
    }

    const textToCopy = currentValues.join(', ');

    navigator.clipboard.writeText(textToCopy).then(
      () => {
        setCopiedCount(currentValues.length);
        setTimeout(() => setCopiedCount(null), 2000); // reset after 2s
      },
      () => {
        setCopiedCount(null);
      },
    );
  };

  const handleSave = async () => {
    const { leadValidationSettingInfo } = useValidationSettingStore.getState();

    if (
      !leadValidationSettingInfo?.lineItemId ||
      !leadValidationSettingInfo?.leadValidationSettingId
    ) {
      notification.error({
        message: 'Missing line item or validation settings information',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Normalize editedData into an array of string values
      let normalizedValues: string[] = [];
      if (editConfig.type === 'list-selection') {
        // Already strings
        normalizedValues = editedData.selectedValues;
      } else {
        // Chips -> extract IDs
        normalizedValues = editedData.selectedValues.map((item: any) =>
          typeof item === 'string' ? item : item.id,
        );
      }

      const requestData = {
        attribute: {
          type: 'OPTIONS',
          value: normalizedValues,
        },
      };

      await updateLineItemsLeadValidationSettingAttribute(
        leadValidationSettingInfo.lineItemId,
        leadValidationSettingInfo.leadValidationSettingId,
        attributeId,
        requestData,
      );

      notification.success({ message: 'Saved successfully!' });

      // Update local state with new values
      setCurrentValues(normalizedValues);

      // Refresh the validation settings data from the backend
      const { fetchConfiguration } = useValidationSettingStore.getState();
      await fetchConfiguration();

      // Call parent callback if provided
      if (onUpdate) {
        onUpdate(normalizedValues);
      }

      setIsEditDrawerOpen(false);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Flex vertical>
        <Flex
          justify='space-between'
          align='flex-start'
          style={{
            backgroundColor: '#F9FAFB',
            borderRadius: '10px',
            padding: '0.5rem',
            margin: '0.5rem 0.75rem',
          }}>
          <Flex style={{ flex: 1 }} vertical>
            <Flex vertical gap='0.5rem'>
              <Text strong style={{ fontSize: '0.875rem' }}>
                {label}{' '}
                <span style={{ fontWeight: 400 }}>
                  ({currentValues.length}{' '}
                  {currentValues.length === 1 ? 'Record' : 'Records'})
                </span>
              </Text>
              {currentValues.length > 0 ? (
                <TruncatedTagList
                  items={currentValues.map((value) => {
                    const option = options.find((opt) => opt.value === value);
                    return {
                      value,
                      label: option ? option.label : value,
                    };
                  })}
                  onViewAll={() => setIsDrawerOpen(true)}
                />
              ) : (
                <Text>No options selected</Text>
              )}
            </Flex>
          </Flex>
          <Flex
            justify='space-between'
            align='center'
            gap='0.6rem'
            style={{ alignSelf: 'flex-start' }}>
            {copiedCount !== null && (
              <Text style={{ fontSize: '0.75rem', color: '#34C759' }}>
                {copiedCount} records copied!
              </Text>
            )}
            <CustomTooltip title='Copy Records'>
              <Flex
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '5px',
                  padding: '0.25rem 0.5rem',
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                }}
                onClick={handleCopy}>
                <CopyOutlined />
              </Flex>
            </CustomTooltip>
            {isEditing && canEditValidationSettings && (
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
            {canViewValidationSettings && (
              <CustomTooltip title='View'>
                <Flex
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIsDrawerOpen(true)}>
                  <EyeOutlined />
                </Flex>
              </CustomTooltip>
            )}
          </Flex>
        </Flex>
      </Flex>
      <DrawerShowList
        label={label}
        show={isDrawerOpen}
        list={currentValues.map((value) => {
          const option = options.find((opt) => opt.value === value);
          return option ? option.label : value;
        })}
        hasChildren={false}
        handleClose={() => setIsDrawerOpen(false)}
      />
      <ValidationEditDrawer
        isOpen={isEditDrawerOpen}
        onClose={handleClose}
        onSave={handleSave}
        isLoading={isLoading}
        title={label}
        editConfig={editConfig}
        editedData={editedData}
        setEditedData={setEditedData}
      />
    </>
  );
};
