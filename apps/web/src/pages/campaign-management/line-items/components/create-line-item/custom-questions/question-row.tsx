import { MapFunction } from '@dzone/shared-ui';
import { DeleteOutlined } from '@ant-design/icons';
import { Flex, Row, Typography } from 'antd';
import { FC, useState } from 'react';
import { FormControlItemContent } from '../../../../components';
import { sanitizeText } from '@dzone/shared-lib';

const { Text } = Typography;

interface IQuestionRowProps {
  field: any;
  restField: Record<string, any>;
  restProps?: Record<string, any>;
}

export const QuestionRow: FC<IQuestionRowProps> = ({
  field,
  restField,
  restProps,
}) => {
  const [colLayout] = useState({
    xs: 24,
    sm: 24,
    md: 24,
    lg: 8,
    xl: 8,
    xxl: 8,
  });

  if (!restProps || !restProps.form) {
    return null;
  }

  const { remove, form, childrenFields = [], lists, transKey } = restProps;
  const renderFormItem = (item: any, _index: number) => {
    item.name = [field, item.field];
    const sanitizeStringOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitizedValue = sanitizeText(e.target.value);
      const path = [`customQuestions`, restField.srNo - 1, item.field];
      form.setFields([{ name: path, value: sanitizedValue }]);
    };

    return (
      <FormControlItemContent
        item={{ ...item, onBlur: sanitizeStringOnBlur }}
        colLayout={colLayout}
        lists={lists}
        transKey={transKey || 'form.createLineItem'}
      />
    );
  };
  return (
    <Flex style={{ marginBottom: '0.5rem' }}>
      <Flex style={{ width: '2rem' }}>
        <Text>{restField.srNo}.</Text>
      </Flex>
      <Row style={{ flex: 1 }} gutter={8}>
        <MapFunction items={childrenFields} renderItem={renderFormItem} />
      </Row>
      <Flex style={{ width: '2.5rem', paddingLeft: '1rem' }}>
        <DeleteOutlined
          style={{ color: 'red', fontSize: '1.5rem' }}
          onClick={() => remove(field)}
        />
      </Flex>
    </Flex>
  );
};
