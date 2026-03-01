import { type FC, useState } from 'react';
import { Flex, Button, Radio, Checkbox, Select, DatePicker } from 'antd';
import { MapFunction } from '@dzone/shared-ui';
import { SystemMessageActionsEnum } from '../../../lib/enums';
import { useDzentStore } from '../../../stores/use-dzent-store';

type DzRecord = Record<string, any>;

interface ActionRendererProps {
  field: DzRecord;
}

export const ActionRenderer: FC<ActionRendererProps> = ({ field }) => {
  const { handleUserMessage } = useDzentStore();

  const handleAction = (value: string) => {
    handleUserMessage({
      userMessage: value,
      state: { [field.name]: value },
    });
  };

  const handleMultiAction = (values: string[]) => {
    handleUserMessage({
      userMessage: values.join(', '),
      state: { [field.name]: values },
    });
  };

  switch (field.type) {
    case SystemMessageActionsEnum.Actions:
      return (
        <Flex gap="0.5rem" wrap="wrap" style={{ marginTop: '0.5rem' }}>
          <MapFunction
            items={field.options || []}
            renderItem={(option: DzRecord) => (
              <Button
                key={option.value}
                onClick={() => handleAction(option.value)}
                style={{ borderRadius: 20 }}
              >
                {option.label}
              </Button>
            )}
          />
        </Flex>
      );

    case SystemMessageActionsEnum.Text:
      return null; // Handled by footer input

    case SystemMessageActionsEnum.Number:
      return null; // Handled by footer input

    case SystemMessageActionsEnum.Radio:
      return (
        <Radio.Group
          onChange={(e) => handleAction(e.target.value)}
          style={{ marginTop: '0.5rem' }}
        >
          <Flex vertical gap="0.25rem">
            <MapFunction
              items={field.options || []}
              renderItem={(option: DzRecord) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              )}
            />
          </Flex>
        </Radio.Group>
      );

    case SystemMessageActionsEnum.Checkbox:
      return (
        <CheckboxAction field={field} onSubmit={handleMultiAction} />
      );

    case SystemMessageActionsEnum.SinglePicklist:
      return (
        <Select
          style={{ width: '100%', maxWidth: 300, marginTop: '0.5rem' }}
          placeholder={field.label || 'Select an option'}
          options={field.options?.map((o: DzRecord) => ({
            label: o.label,
            value: o.value,
          }))}
          onChange={(value) => handleAction(value)}
        />
      );

    case SystemMessageActionsEnum.MultiPicklist:
      return (
        <MultiPicklistAction field={field} onSubmit={handleMultiAction} />
      );

    case SystemMessageActionsEnum.Date:
      return (
        <DatePicker
          style={{ marginTop: '0.5rem', maxWidth: 300 }}
          onChange={(_, dateString) =>
            handleAction(dateString as string)
          }
        />
      );

    case SystemMessageActionsEnum.Daterange:
      return (
        <DatePicker.RangePicker
          style={{ marginTop: '0.5rem', maxWidth: 400 }}
          onChange={(_, dateStrings) =>
            handleAction(dateStrings.join(' to '))
          }
        />
      );

    default:
      return null;
  }
};

// Sub-component: Checkbox with submit
const CheckboxAction: FC<{
  field: DzRecord;
  onSubmit: (values: string[]) => void;
}> = ({ field, onSubmit }) => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <Flex vertical gap="0.5rem" style={{ marginTop: '0.5rem' }}>
      <Checkbox.Group
        value={selected}
        onChange={(values) => setSelected(values as string[])}
      >
        <Flex vertical gap="0.25rem">
          <MapFunction
            items={field.options || []}
            renderItem={(option: DzRecord) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            )}
          />
        </Flex>
      </Checkbox.Group>
      <Button
        type="primary"
        size="small"
        disabled={selected.length === 0}
        onClick={() => onSubmit(selected)}
        style={{ alignSelf: 'flex-start' }}
      >
        Submit
      </Button>
    </Flex>
  );
};

// Sub-component: Multi-picklist with submit
const MultiPicklistAction: FC<{
  field: DzRecord;
  onSubmit: (values: string[]) => void;
}> = ({ field, onSubmit }) => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <Flex vertical gap="0.5rem" style={{ marginTop: '0.5rem' }}>
      <Select
        mode="multiple"
        style={{ width: '100%', maxWidth: 400 }}
        placeholder={field.label || 'Select options'}
        options={field.options?.map((o: DzRecord) => ({
          label: o.label,
          value: o.value,
        }))}
        value={selected}
        onChange={setSelected}
      />
      <Button
        type="primary"
        size="small"
        disabled={selected.length === 0}
        onClick={() => onSubmit(selected)}
        style={{ alignSelf: 'flex-start' }}
      >
        Submit
      </Button>
    </Flex>
  );
};
