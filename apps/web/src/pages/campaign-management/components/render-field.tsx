// TODO: Migrate renderField from dzone-ui
import React from 'react';
import { Input, InputNumber, Select, DatePicker, Checkbox } from 'antd';
import type { FormInstance } from 'antd';

const { TextArea } = Input;

/**
 * Renders a form field based on its fieldType configuration.
 * Stub implementation - full migration from dzone-ui pending.
 */
export const renderField = (
  field: any,
  lists: Record<string, any[]>,
  _form: FormInstance<any>,
  _tenantCode?: string,
  _initialFiles?: Record<string, any>,
): React.ReactNode => {
  const commonProps = {
    disabled: field.isReadOnly || field.disabled,
    placeholder: field.placeholder || field.label,
  };

  switch (field.fieldType) {
    case 'text':
      return <Input className='input-field' {...commonProps} />;
    case 'number':
      return <InputNumber className='input-field' style={{ width: '100%' }} {...commonProps} />;
    case 'textArea':
      return <TextArea className='input-field' {...commonProps} />;
    case 'select':
    case 'searchableSelect':
      return (
        <Select
          className='input-field'
          showSearch={field.fieldType === 'searchableSelect'}
          options={lists[field.optionsKey]?.map((opt: any) => ({
            label: opt.label || opt.text || opt.value,
            value: opt.value || opt.name,
          }))}
          {...commonProps}
        />
      );
    case 'multiselect':
      return (
        <Select
          mode='multiple'
          className='input-field'
          options={lists[field.optionsKey]?.map((opt: any) => ({
            label: opt.label || opt.text || opt.value,
            value: opt.value || opt.name,
          }))}
          {...commonProps}
        />
      );
    case 'date':
      return <DatePicker className='input-field' style={{ width: '100%' }} />;
    case 'checkbox':
      return <Checkbox disabled={field.isReadOnly}>{field.label}</Checkbox>;
    default:
      return <Input className='input-field' {...commonProps} />;
  }
};
