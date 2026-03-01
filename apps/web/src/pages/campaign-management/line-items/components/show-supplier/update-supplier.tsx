import { Button, Flex, Select, notification } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React, { FC } from 'react';
import { updateLineItem } from '../../services';

interface IUpdateSupplierProps {
  options: { label: string; value: string }[];
  afterUpdateSupplierName?: (name: string) => void;
  cancelUpdateSupplierName?: () => void;
  lineItemId: string;
}

export const UpdateSupplier: FC<IUpdateSupplierProps> = ({
  options,
  afterUpdateSupplierName,
  cancelUpdateSupplierName,
  lineItemId,
}) => {
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
    undefined,
  );
  const handleChange = (value: string) => {
    setSelectedValue(value);
  };
  const updateSupplier = async () => {
    try {
      const { data } = await updateLineItem(
        {
          supplierCode: selectedValue,
          supplier: options.find((option) => option.value === selectedValue)
            ?.label,
        },
        lineItemId,
      );
      notification.success({
        message: 'Supplier updated successfully',
      });
      afterUpdateSupplierName && afterUpdateSupplierName(data.supplier);
      setSelectedValue(undefined);
    } catch (error) {}
  };
  return (
    <Flex gap={12} style={{ marginTop: '-0.25rem' }}>
      <Flex>
        <Select
          options={options}
          onChange={handleChange}
          placeholder='Select Supplier'
          value={selectedValue}
          style={{ height: '2rem', width: '10rem' }}
        />
      </Flex>
      <Flex gap={4}>
        <Button
          type='primary'
          size='small'
          disabled={!selectedValue}
          onClick={() => {
            selectedValue && updateSupplier();
          }}>
          <CheckOutlined />
        </Button>
        <Button
          size='small'
          onClick={() => {
            setSelectedValue(undefined);
            cancelUpdateSupplierName && cancelUpdateSupplierName();
          }}>
          <CloseOutlined />
        </Button>
      </Flex>
    </Flex>
  );
};
