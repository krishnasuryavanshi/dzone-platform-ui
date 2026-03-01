import { Flex } from 'antd';
import { FC, PropsWithChildren } from 'react';
import { UploadProgress } from './upload-progress';
import { UploadNotification } from './upload-notification';
import { IDialogState } from '../../lib/types';

import './upload-dialog.css';

interface IUploadDialogProps extends PropsWithChildren {
  dialogState: IDialogState;
  onClose: () => void;
}

export const UploadDialog: FC<IUploadDialogProps> = ({
  dialogState: { isDialogOpen, dialogType, progress, message },
  onClose,
  children,
}) => {
  if (!isDialogOpen) return null;
  return (
    <Flex vertical className={`dz-upload-dialog ${dialogType}`}>
      <Flex vertical className="dz-upload-dialog-content">
        <UploadProgress
          show={dialogType === 'Progress'}
          progress={progress}
        />
        <UploadNotification
          show={dialogType === 'Success' || dialogType === 'Error'}
          message={message}
          type={dialogType}
          onClose={onClose}>
          {children}
        </UploadNotification>
      </Flex>
    </Flex>
  );
};
