import { type FC, type CSSProperties, useState } from 'react';
import { Button, Col, Flex, InputNumber, Row, Typography } from 'antd';
import type { InputNumberProps } from 'antd';

const { Text } = Typography;

interface Props {
  options: { label: string; value: string }[];
  onAddOption: (option: { label: string; value: string }) => void;
  onCancel: () => void;
  variant?: 'default' | 'small';
}

export const DropdownCustomAddOptions: FC<Props> = ({
  options,
  onCancel,
  onAddOption,
  variant = 'default',
}) => {
  const [values, setValues] = useState({ min: 0, max: 10000 });
  const [errors, setErrors] = useState<{ min: string | null; max: string | null }>({
    min: null,
    max: null,
  });

  const validateNumbers = (field: 'min' | 'max', val: { min: number; max: number }) => {
    const newErrors = { ...errors };
    if (field === 'min') {
      newErrors.max = null;
      if (val.min < 0) newErrors.min = 'Min count cannot be less than 0';
      else if (val.min >= val.max) newErrors.min = 'Min count must be less than Max count';
      else newErrors.min = null;
    } else {
      newErrors.min = null;
      if (val.max <= val.min) newErrors.max = 'Max count must be greater than Min count';
      else newErrors.max = null;
    }
    setErrors(newErrors);
  };

  const onMinChange: InputNumberProps['onChange'] = (value) => {
    const val = { ...values, min: value as number };
    setValues(val);
    validateNumbers('min', val);
  };

  const onMaxChange: InputNumberProps['onChange'] = (value) => {
    const val = { ...values, max: value as number };
    setValues(val);
    validateNumbers('max', val);
  };

  const handleAddOption = () => {
    const existing = options.find((o) => o.value === `${values.min}-${values.max}`);
    if (existing) {
      onCancel();
      return;
    }
    onAddOption({ label: `${values.min}-${values.max}`, value: `${values.min}-${values.max}` });
  };

  const TextStyles: CSSProperties = {
    fontSize: variant === 'small' ? '0.875rem' : '1rem',
  };

  return (
    <Flex vertical gap="0.5rem">
      <Text strong style={TextStyles}>
        Add a custom count range
      </Text>
      <Row gutter={16} style={{ marginBlock: '0.5rem' }}>
        <Col span={12}>
          <Flex vertical gap="0.25rem" style={{ width: '100%' }}>
            <Text style={TextStyles}>Min Count</Text>
            <InputNumber
              status={errors.min ? 'error' : undefined}
              style={{ width: '100%' }}
              min={0}
              onChange={onMinChange}
              value={values.min}
              size={variant === 'small' ? 'small' : undefined}
            />
            {errors.min && (
              <Text type="danger" style={{ fontSize: '0.75rem' }}>
                {errors.min}
              </Text>
            )}
          </Flex>
        </Col>
        <Col span={12}>
          <Flex vertical gap="0.25rem" style={{ width: '100%' }}>
            <Text style={TextStyles}>Max Count</Text>
            <InputNumber
              status={errors.max ? 'error' : undefined}
              style={{ width: '100%' }}
              min={1}
              onChange={onMaxChange}
              value={values.max}
              size={variant === 'small' ? 'small' : undefined}
            />
            {errors.max && (
              <Text type="danger" style={{ fontSize: '0.75rem' }}>
                {errors.max}
              </Text>
            )}
          </Flex>
        </Col>
      </Row>
      <Flex justify="flex-end" gap="0.25rem">
        <Button type="text" size="small" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="text"
          size="small"
          onClick={handleAddOption}
          disabled={!!(!(values.min >= 0) || !values.max || errors.min || errors.max)}>
          <Text strong style={{ color: '#235AED' }}>
            Save
          </Text>
        </Button>
      </Flex>
    </Flex>
  );
};
