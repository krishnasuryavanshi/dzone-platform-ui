import { type FC } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Select, Space } from 'antd';
import { Text } from './text';
import styles from './simple-pagination.module.css';

interface SimplePaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];
}

export const SimplePagination: FC<SimplePaginationProps> = ({
  current,
  pageSize,
  total,
  onChange,
  pageSizeOptions = [25, 50, 100],
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);

  const handlePageSizeChange = (value: number) => {
    onChange(1, value);
  };

  const handlePrevious = () => {
    if (current > 1) onChange(current - 1, pageSize);
  };

  const handleNext = () => {
    if (current < totalPages) onChange(current + 1, pageSize);
  };

  const pageSizeSelectOptions = pageSizeOptions.map((size) => ({
    label: size.toString(),
    value: size,
  }));

  return (
    <div className={styles.paginationContainer}>
      <Space size="small" className={styles.rowsSelector}>
        <Text className={styles.rowsLabel}>Rows</Text>
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          className={styles.pageSizeSelect}
          popupClassName={styles.pageSizeDropdown}
          options={pageSizeSelectOptions}
        />
      </Space>

      <Text className={styles.itemsInfo}>
        {startItem}-{endItem} of {total}
      </Text>

      <Space size="small" className={styles.navigationButtons}>
        <Button
          type="primary"
          icon={<LeftOutlined />}
          onClick={handlePrevious}
          disabled={current === 1}
          className={`ant-btn-icon-only ${styles.navButtonPrimary} ${styles.customWidth}`}
        />
        <Button
          type="primary"
          icon={<RightOutlined />}
          onClick={handleNext}
          disabled={current >= totalPages}
          className={`ant-btn-icon-only ${styles.navButtonPrimary} ${styles.customWidth}`}
        />
      </Space>
    </div>
  );
};
