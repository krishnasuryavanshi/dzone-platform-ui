import { Input, InputNumber, DatePicker, Checkbox } from 'antd';
import type { FormInstance } from 'antd';
import { renderSelect } from './render-select';
import { PacingChartPreview } from './pacing-chart';
import { DynamicFileUpload } from '@/components/shared/file-upload/file-upload-wrapper';
import { IPacingChartType } from '../../lib/types';
import dayjs from 'dayjs';

const { TextArea } = Input;

export const renderField = (
  field: any,
  lists: Record<string, any[]>,
  pacingSchedule: IPacingChartType[],
  form: FormInstance<any>,
  tenantCode?: string,
  initialFiles?: {
    assetFiles?: string[];
    deliveryTemplateFile?: Record<string, any>;
  },
) => {
  const commonProps = {
    disabled: field.isReadOnly,
    placeholder: field.placeholder,
  };

  const assetFiles = initialFiles?.assetFiles;
  const deliveryTemplateFile = initialFiles?.deliveryTemplateFile;
  const handleUploadComplete = (data: any, field: any) => {
    form.setFieldValue(field, data);
  };
  switch (field.fieldType) {
    case 'text':
      return (
        <Input
          className='input-field'
          style={{ height: '3rem' }}
          {...commonProps}
        />
      );
    case 'number':
      return (
        <InputNumber
          className='input-field'
          style={{ width: '100%' }}
          {...commonProps}
        />
      );
    case 'textArea':
      return <TextArea className='input-field' {...commonProps} />;
    case 'multiselect':
      return renderSelect({
        field,
        mode: 'multiple',
        searchable: !!field.hasMultiselectSearch,
        options: lists[field.optionsKey] || [],
      });
    case 'searchableSelect':
      return renderSelect({
        field,
        searchable: true,
        options: lists[field.optionsKey] || [],
      });
    case 'select':
      return renderSelect({
        field,
        options: lists[field.optionsKey] || [],
      });
    case 'date':
      const fieldValue = form.getFieldValue(field.field);
      const validDate = fieldValue ? dayjs(fieldValue) : null;
      return (
        <DatePicker
          value={validDate && validDate.isValid() ? validDate : null}
          className='input-field'
          onChange={(date) => {
            if (date) {
              form.setFieldValue(field.field, date);
            } else {
              form.setFieldValue(field.field, null);
            }
          }}
          style={{ width: '100%' }}
        />
      );
    case 'checkbox': {
      const fieldValue = form.getFieldValue(field.field);
      return (
        <Checkbox
          checked={fieldValue}
          disabled={field.isReadOnly}
          onChange={(e) => form.setFieldValue(field.field, e.target.checked)}>
          {field.label}
        </Checkbox>
      );
    }
    case 'pacingChart':
      return <PacingChartPreview pacingSchedule={pacingSchedule} />;
    case 'multipleFileUpload':
      return (
        <DynamicFileUpload
          key={field.fileTypeName}
          fileTypeName={field.fileTypeName}
          uploadType='multiple'
          onUploadComplete={(data) => handleUploadComplete(data, field.field)}
          tenantCode={tenantCode}
          value={assetFiles}
        />
      );
    case 'fileUpload':
      return (
        <DynamicFileUpload
          key={field.fileTypeName}
          fileTypeName={field.fileTypeName}
          uploadType='single'
          onUploadComplete={(data) => handleUploadComplete(data, field.field)}
          tenantCode={tenantCode}
          value={deliveryTemplateFile}
        />
      );
    default:
      return null;
  }
};
