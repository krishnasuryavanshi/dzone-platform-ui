import type { UploadFile, UploadProps } from 'antd';
import { notification, Button } from 'antd';
import { FC, useEffect, useState } from 'react';
import { IDialogState } from '../../lib/types';
import { getUploadProps, handleUploadApi } from '../../lib/utils';
import { UploadButtonIcon } from './upload-button-icon';
import { UploadDialog } from './upload-dialog';
import { UploadSuccessContent } from './upload-success-content';
import { FileUploadModal } from '../../../components/file-upload-modal-component/file-upload-modal';
import { FileTypeSelection } from '../../../lib/enums';
import { fetchFileUploadMetadata } from '../../../../lead-validation/services';

interface IUploadLeadsProps {
  lineItemId: string;
  refreshLeadsList: () => void;
  tenantCode?: string;
  validationSettingsId?: string;
  onUploadStart?: (requestId?: string) => void;
}

export const UploadLeads: FC<IUploadLeadsProps> = ({
  lineItemId,
  refreshLeadsList: _refreshLeadsList,
  tenantCode,
  validationSettingsId,
  onUploadStart,
}) => {
  const [dialogState, setDialogState] = useState<IDialogState>({
    isDialogOpen: false,
    dialogType: 'Progress',
    progress: 0,
    message: '',
  });

  const [uploadProps, setUploadProps] = useState<UploadProps>({});
  const [selectedFile, setSelectedFile] = useState<UploadFile>(
    {} as UploadFile,
  );
  const [selectedType, setSelectedType] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSelectedFile = (file: UploadFile) => {
    setSelectedFile(file);
  };

  const handleDialogState = (
    stateItem: Record<string, string | number | boolean>,
  ) => {
    setDialogState((state) => ({ ...state, ...stateItem }));
  };

  const handleCloseDialog = () => {
    setDialogState((state) => ({ ...state, isDialogOpen: false }));
  };

  useEffect(() => {
    fetchFileUploadMeta();
  }, []);

  const fetchFileUploadMeta = async () => {
    const response = await fetchFileUploadMetadata('lead-file');
    if (response?.data) {
      setUploadProps(
        getUploadProps(response?.data, handleDialogState, handleSelectedFile),
      );
      setIsLoading(false);
    }
  };

  const handleTypeSelection = (type: string) => {
    setSelectedType(type);
  };

  const handleCancel = () => {
    setSelectedFile({} as UploadFile);
    setSelectedType('');
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    try {
      if (!selectedFile.originFileObj) {
        notification.error({
          message: 'Please select a file',
        });
        return;
      }
      if (selectedType === '') {
        notification.error({
          message: 'Please select if net new leads or existing leads',
        });
        return;
      }
      const response = await handleUploadApi(
        selectedFile.originFileObj as Blob,
        lineItemId,
        selectedType,
        handleDialogState,
        tenantCode || '',
      );
      if (response?.requestId) {
        // Trigger validation monitoring in parent component with requestId
        onUploadStart?.(response.requestId);
        handleCancel();
      }
    } catch (error) {}
  };

  return (
    <>
      <Button
        type='primary'
        size='small'
        className='dz-btn-action-1'
        style={{ width: '5.6rem', boxShadow: 'none' }}
        onClick={() => !isLoading && setIsModalOpen(true)}>
        <UploadButtonIcon isLoading={isLoading} />
      </Button>
      <FileUploadModal
        isOpen={isModalOpen}
        handleCancel={handleCancel}
        handleSave={handleSave}
        uploadProps={uploadProps}
        selectedFile={selectedFile}
        handleTypeSelection={handleTypeSelection}
        fileTypeSelection={FileTypeSelection.Leads}
        title='Upload Lead File'
        downloadTemplateProps={{
          lineItemId,
          validationSettingsId,
          tenantCode: tenantCode,
        }}
      />
      <UploadDialog dialogState={dialogState} onClose={handleCloseDialog}>
        <UploadSuccessContent
          show={dialogState.dialogType === 'Success'}
          info={dialogState.info}
          onClickViewLeads={handleDialogState}
        />
      </UploadDialog>
    </>
  );
};
