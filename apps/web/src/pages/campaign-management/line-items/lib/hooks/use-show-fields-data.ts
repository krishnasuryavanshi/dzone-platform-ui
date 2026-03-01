import { get } from 'lodash-es';
import { useEffect, useState } from 'react';
import { usePermissionsStore } from '@dzone/shared-store';
import { checkPermission, FieldType } from '@dzone/shared-lib';
import { ILineItem } from '../types';

interface FieldConfig {
  field: string;
  label: string;
  viewField?: string;
  viewTranslationKey?: string;
  viewOrder: number;
  fieldType: FieldType;
  permissions?: {
    view?: string | string[];
  };
  viewComponent?: string;
  section?: string; // NEW: section key
  dataIndex?: string;
}

export interface FieldObject {
  field: string;
  label: string;
  viewOrder: number;
  viewType: FieldType;
  value: any;
  viewComponent?: string;
}

export interface FieldsList {
  section: string;
  fields: FieldObject[];
}

const getFieldValue = (data: any, field: string, isCheckbox?: boolean) => {
  const value = get(data, field.split('.'));
  if (isCheckbox) {
    return value ? 'Yes' : 'No';
  }
  return value;
};

export const useShowFieldsData = (
  data: ILineItem,
  formConfig: FieldConfig[],
) => {
  const { accesses, attributes } = usePermissionsStore();
  const [fieldsList, setFieldsList] = useState<FieldsList[]>([]);

  useEffect(() => {
    if (!data || !formConfig) return;

    const grouped: Record<string, FieldObject[]> = {};

    formConfig.forEach((field) => {
      const section = field.section || 'Basic Details';

      const hasPermission = checkPermission(
        field.permissions?.view || '',
        field.field === 'actions' ? accesses : attributes,
      );

      const isVisible = field.viewOrder && hasPermission;
      if (!isVisible) return;

      const dataProperty = field.viewField || field.dataIndex || field.field;
      const value = getFieldValue(
        data,
        dataProperty,
        field.fieldType === FieldType.Checkbox ||
          field.fieldType === FieldType.RadioButton,
      );

      const fieldObject: FieldObject = {
        field: field.field,
        label: field.label,
        viewOrder: field.viewOrder,
        viewType: field.fieldType,
        value,
      };

      if (field.fieldType === FieldType.CustomComponent) {
        fieldObject.viewComponent = field.viewComponent;
      }

      if (!grouped[section]) grouped[section] = [];
      grouped[section].push(fieldObject);
    });

    const result: FieldsList[] = Object.entries(grouped)
      .map(([section, fields]) => ({
        section,
        fields: fields.sort((a, b) => a.viewOrder - b.viewOrder),
      }))
      .filter((group) => group.fields.length > 0);

    setFieldsList(result);
  }, [data, formConfig]);

  return { fieldsList };
};
