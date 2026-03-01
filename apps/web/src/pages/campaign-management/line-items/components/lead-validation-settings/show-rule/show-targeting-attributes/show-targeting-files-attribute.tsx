import { Flex, Typography, notification } from 'antd';
import { EyeOutlined, FileOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { MapFunction } from '@dzone/shared-ui';
import { usePermissionCheck } from '@dzone/shared-auth';
import { LineItemActionsEnum } from '@dzone/shared-lib';
import { useState, useEffect } from 'react';
import { TargetingAttributeValuesDrawer } from './targeting-attribute-values-drawer';
import { fileDownload } from '../../../../services';
import { ValidationEditDrawer } from '../../../edit-drawer/validation-edit-drawer';
import { updateLineItemsLeadValidationSettingAttribute } from '../../../../../../lead-validation/services';
import { useValidationSettingStore } from '../../../../../../lead-validation/stores/use-validation-settings-store';
import { CustomTooltip } from './custom-tooltip';

const { Text } = Typography;

type ShowTargetingFileAttributeProps = {
  type: 'INCLUSION' | 'EXCLUSION';
  files: Record<string, any>[];
  label: string;
  attributeId: string;
  onUpdate?: (newFiles: Record<string, any>[]) => void;
  isEditing?: boolean;
  isFirst?: boolean;
};

const DrawerItemStyle = {
  padding: '0.5rem',
  borderRadius: '5px',
  border: '1px solid #D3E3EE',
};

export const ShowTargetingFileAttribute = ({
  type,
  files,
  label,
  attributeId,
  onUpdate,
  isEditing = false,
  isFirst = false,
}: ShowTargetingFileAttributeProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFiles, setCurrentFiles] = useState<Record<string, any>[]>(files);

  const canEditValidationSettings = usePermissionCheck(LineItemActionsEnum.EditValidationSettings);
  const canViewValidationSettings = usePermissionCheck(LineItemActionsEnum.ViewValidationSettings);

  const enabledFiles = currentFiles.filter((file) => !file.isDisabled);

  useEffect(() => {
    setCurrentFiles(files);
  }, [files]);

  const handleDownloadFile = async (fileId: string) => {
    try {
      await fileDownload(fileId);
    } catch (error) {}
  };

  const handleDownloadAllFiles = async () => {
    if (!enabledFiles?.length) return;

    for (const f of enabledFiles) {
      try {
        await handleDownloadFile(f.id);
        // Add a small delay between downloads to prevent browser blocking
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {}
    }

    notification.success({
      message: `Downloaded ${enabledFiles.length} file(s)`,
    });
  };
  const handleEdit = () => {
    // Initialize editedData with current files when opening the drawer
    const initialFiles = currentFiles.map((file) => ({
      ...file,
      isDisabled: file.isDisabled === true,
    }));
    setEditedData(initialFiles);
    setIsEditDrawerOpen(true);
  };

  const handleClose = () => {
    setIsEditDrawerOpen(false);
    setEditedData([]);
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
      const filesToSave =
        Array.isArray(editedData) && editedData.length > 0
          ? editedData
          : currentFiles;

      const requestData = {
        attribute: {
          name: label.toLowerCase(),
          type,
          value: filesToSave.map((f: any) => ({
            id: f.id,
            isDisabled: f.isDisabled === true,
          })),
        },
      };

      await updateLineItemsLeadValidationSettingAttribute(
        leadValidationSettingInfo.lineItemId,
        leadValidationSettingInfo.leadValidationSettingId,
        attributeId,
        requestData,
      );

      notification.success({
        message: 'File list saved successfully!',
      });

      const { fetchConfiguration } = useValidationSettingStore.getState();
      await fetchConfiguration();

      if (onUpdate) {
        onUpdate(filesToSave);
      }

      setIsEditDrawerOpen(false);
    } catch (error) {
      notification.error({ message: 'Failed to save file list.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFileDetails = (file: Record<string, any>) => {
    return (
      <Flex vertical style={DrawerItemStyle} key={file.id}>
        <Flex
          justify='space-between'
          align='center'
          style={{ marginTop: '0.25rem' }}>
          <Text>{file.name}</Text>
          <Flex
            style={{
              backgroundColor: '#fff',
              borderRadius: '5px',
              padding: '0.25rem 0.5rem',
              border: '1px solid #ddd',
              cursor: 'pointer',
            }}>
            <DownloadOutlined onClick={() => handleDownloadFile(file.id)} />
          </Flex>
        </Flex>
      </Flex>
    );
  };

  return (
    <>
      <Flex vertical>
        <Flex vertical>
          <Flex style={{ paddingTop: isFirst ? '0.75rem' : 0 }}>
            <Text
              strong
              style={{ fontSize: '0.875rem', marginLeft: '0.75rem' }}>
              {label}
            </Text>
          </Flex>
          <Flex
            justify='space-between'
            align='center'
            style={{
              backgroundColor: '#F9FAFB',
              borderRadius: '10px',
              padding: '0.5rem',
              margin: '0rem 0.75rem',
            }}>
            <Flex>
              <Flex gap='0.5rem' align='center'>
                <Flex
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #235AED29',
                  }}>
                  <FileOutlined style={{ color: '#3D71FB' }} />
                </Flex>
                <Text style={{ color: '#707070', fontSize: '0.875rem' }} strong>
                  {type === 'INCLUSION' ? 'Inclusion List' : 'Suppression List'}
                  {enabledFiles.length > 0 && (
                    <span style={{ fontWeight: 400, marginLeft: '0.5rem' }}>
                      (
                      {`${enabledFiles.length} File${enabledFiles.length > 1 ? 's' : ''}`}
                      )
                    </span>
                  )}
                </Text>
              </Flex>
            </Flex>
            <Flex justify='space-between' align='center' gap='0.6rem'>
              <CustomTooltip title='Download Files'>
                <Flex
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                  }}
                  onClick={handleDownloadAllFiles}>
                  <DownloadOutlined />
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
      </Flex>
      <TargetingAttributeValuesDrawer
        header={`${label} (${type === 'INCLUSION' ? 'Inclusion List' : 'Suppression List'})`}
        isOpen={isDrawerOpen}
        handleClose={() => setIsDrawerOpen(false)}>
        <Flex vertical gap='0.5rem'>
          <MapFunction items={enabledFiles} renderItem={renderFileDetails} />
        </Flex>
      </TargetingAttributeValuesDrawer>
      <ValidationEditDrawer
        isOpen={isEditDrawerOpen}
        onClose={handleClose}
        title={`${label} (${type === 'INCLUSION' ? 'Inclusion List' : 'Suppression List'})`}
        onSave={handleSave}
        isLoading={isLoading}
        editConfig={{
          type: 'files',
          fileMetaTypeName: currentFiles?.[0]?.type,
          props: {
            allowUpload: true,
            allowDelete: true,
            acceptedFileTypes: ['.csv', '.xlsx', '.txt'],
          },
        }}
        editedData={editedData}
        setEditedData={setEditedData}
      />
    </>
  );
};
