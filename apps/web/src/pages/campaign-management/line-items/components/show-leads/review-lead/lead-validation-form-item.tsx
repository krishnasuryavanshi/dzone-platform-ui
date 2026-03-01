import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import { FC } from 'react';
import {
  TextInput,
  NumberInput,
  EmailInput,
  UrlInput,
  DateInput,
  DropdownInput,
} from './inputs';

interface ILeadValidationFormItemProps {
  field: Record<string, any>;
  validateField: (field: Record<string, any>) => (_: any, value: any) => Promise<void>;
}

export const LeadValidationFormItem: FC<ILeadValidationFormItemProps> = ({
  field,
  validateField,
}) => {
  const { t } = useTranslation();

  const renderInput = () => {
    const commonProps = {
      placeholder: field.placeholder,
      className: 'input-field',
    };

    switch (field.type?.toLowerCase()) {
      case 'text':
        return <TextInput {...commonProps} />;

      case 'number':
        return <NumberInput {...commonProps} />;

      case 'email':
        return <EmailInput {...commonProps} />;

      case 'url':
        return <UrlInput {...commonProps} />;

      case 'phone':
      case 'tel':
        return <TextInput {...commonProps} />;

      case 'date':
        return (
          <DateInput {...commonProps} format={field.format || 'YYYY-MM-DD'} />
        );

      case 'dropdown':
        return (
          <DropdownInput
            {...commonProps}
            className='select-field'
            options={field.options}
          />
        );

      default:
        return <TextInput {...commonProps} />;
    }
  };

  return (
    <Form.Item
      name={field.name}
      rules={[
        {
          validator: validateField(field),
        },
      ]}
      label={t(field.label)}
      className='form-control-item'>
      {renderInput()}
    </Form.Item>
  );
};
