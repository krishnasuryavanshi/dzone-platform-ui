// TODO: Migrate CreateFormContent from dzone-ui
import { FC } from 'react';
import type { FormInstance } from 'antd';

interface CreateFormContentProps {
  stepFields?: any;
  lists?: Record<string, any[]>;
  form?: FormInstance;
  entityId?: string;
}

export const CreateFormContent: FC<CreateFormContentProps> = () => {
  // Stub - will be replaced with full migration from dzone-ui
  return null;
};
