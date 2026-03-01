import { FC, useEffect, useState } from 'react';
import { Form, Checkbox, Button, Flex, Input, Row, Typography } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useTranslation } from 'react-i18next';
import { ILineItem } from '../../lib/types';
import { updateLineItem } from '../../services';
import { useNavigate } from 'react-router';
import { CustomQuestions } from '../create-line-item/custom-questions';
import CustomQuestionsFields from '../../lib/schemas/custom-questions.json';
import { LoaderButton } from '@dzone/shared-ui';
import { isEqual } from 'lodash-es';

const { Text } = Typography;

interface ICustomQuestionsContainerProps {
  lineItemDetails?: ILineItem;
}

export const CustomQuestionsContainer: FC<ICustomQuestionsContainerProps> = ({
  lineItemDetails,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasCustomQuestions, setHasCustomQuestions] = useState<boolean>(false);
  const [addQuestionError, setAddQuestionError] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState(false);

  const instructionField = (CustomQuestionsFields as any[]).find(
    (f: any) => f.field === 'customQuestionInstructions',
  );
  const customQuestionsField = (CustomQuestionsFields as any[]).find(
    (f: any) => f.field === 'customQuestions',
  );
  const additionalInstructionsField = (CustomQuestionsFields as any[]).find(
    (f: any) => f.field === 'additionalInstructions',
  );

  const normalizeQuestions = (questions: any[]) =>
    questions?.map((q: any) => ({
      question: q.question?.trim(),
      acceptedAnswer: q.acceptedAnswer?.trim(),
      rejectedAnswer: q.rejectedAnswer?.trim(),
    })) || [];

  const checkIfFormChanged = (
    formValues: any = form.getFieldsValue(),
    overrideCheckboxValue?: boolean,
  ) => {
    const currentCheckbox = overrideCheckboxValue ?? hasCustomQuestions;

    const normalizedCurrent = {
      hasCustomQuestions: currentCheckbox,
      customQuestionInstructions:
        formValues.customQuestionInstructions?.trim() || '',
      customQuestions: normalizeQuestions(formValues.customQuestions),
      additionalInstructions: formValues.additionalInstructions?.trim() || '',
    };

    const normalizedOriginal = {
      hasCustomQuestions: lineItemDetails?.hasCustomQuestions || false,
      customQuestionInstructions:
        lineItemDetails?.customQuestionInstructions?.trim() || '',
      customQuestions: normalizeQuestions(
        lineItemDetails?.customQuestions || [],
      ),
      additionalInstructions:
        lineItemDetails?.additionalInstructions?.trim() || '',
    };

    const isChanged = !isEqual(normalizedCurrent, normalizedOriginal);
    setHasChanges(isChanged);
  };

  useEffect(() => {
    if (lineItemDetails) {
      form.setFieldsValue({
        customQuestionInstructions:
          lineItemDetails.customQuestionInstructions || '',
        customQuestions: lineItemDetails.customQuestions || [],
        additionalInstructions: lineItemDetails.additionalInstructions || '',
      });

      setHasCustomQuestions(lineItemDetails.hasCustomQuestions || false);

      // Delay to ensure form state and local state are fully updated
      setTimeout(() => {
        checkIfFormChanged(
          {
            customQuestionInstructions:
              lineItemDetails.customQuestionInstructions || '',
            customQuestions: lineItemDetails.customQuestions || [],
            additionalInstructions:
              lineItemDetails.additionalInstructions || '',
          },
          lineItemDetails.hasCustomQuestions || false,
        );
      }, 0);
    }
  }, [lineItemDetails, form]);

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    setHasCustomQuestions(isChecked);

    if (!isChecked) {
      form.setFieldsValue({
        customQuestionInstructions: '',
        customQuestions: [],
        // Note: We don't clear additionalInstructions as it should be available always
      });
      setAddQuestionError(false);
    }

    checkIfFormChanged(undefined, isChecked);
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.customQuestions) {
      const updatedQuestions = changedValues.customQuestions;
      const errorsToClear = updatedQuestions.map(
        (question: any, index: number) => {
          const errors: any[] = [];

          if (question.question) {
            errors.push({
              name: ['customQuestions', index, 'question'],
              errors: [],
            });
          }
          if (question.acceptedAnswer) {
            errors.push({
              name: ['customQuestions', index, 'acceptedAnswer'],
              errors: [],
            });
          }
          if (question.rejectedAnswer) {
            errors.push({
              name: ['customQuestions', index, 'rejectedAnswer'],
              errors: [],
            });
          }
          return errors;
        },
      );

      errorsToClear.push({
        name: ['customQuestions'],
        errors: [],
      });

      form.setFields(errorsToClear.flat());
      setAddQuestionError(false);
    }

    checkIfFormChanged(allValues);
  };

  const handleSubmit = async () => {
    if (!hasChanges) {
      handleCancel();
      return;
    }
    try {
      const values = await form.validateFields();
      const sanitizedValues = {
        customQuestionInstructions:
          values.customQuestionInstructions?.trim() || '',
        customQuestions: normalizeQuestions(values.customQuestions),
        additionalInstructions: values.additionalInstructions?.trim() || '',
      };

      if (
        hasCustomQuestions &&
        (!sanitizedValues.customQuestions ||
          sanitizedValues.customQuestions.length === 0)
      ) {
        setAddQuestionError(true);
        return;
      }

      const invalidQuestions = sanitizedValues.customQuestions?.filter(
        (question: any) =>
          !question.acceptedAnswer?.trim() || !question.rejectedAnswer?.trim(),
      );

      if (invalidQuestions?.length > 0) {
        form.setFields([
          {
            name: 'customQuestions',
            errors: ['This is required.'],
          },
        ]);
        return;
      }

      const changedFields: Record<string, any> = {};
      if (hasCustomQuestions !== lineItemDetails?.hasCustomQuestions) {
        changedFields.hasCustomQuestions = hasCustomQuestions;
      }
      if (
        !isEqual(
          sanitizedValues.customQuestions,
          normalizeQuestions(lineItemDetails?.customQuestions || []),
        )
      ) {
        changedFields.customQuestions = sanitizedValues.customQuestions;
      }
      if (
        sanitizedValues.customQuestionInstructions !==
        (lineItemDetails?.customQuestionInstructions?.trim() || '')
      ) {
        changedFields.customQuestionInstructions =
          sanitizedValues.customQuestionInstructions;
      }
      if (
        sanitizedValues.additionalInstructions !==
        (lineItemDetails?.additionalInstructions?.trim() || '')
      ) {
        changedFields.additionalInstructions =
          sanitizedValues.additionalInstructions;
      }

      if (Object.keys(changedFields).length === 0) return;

      setLoading(true);
      const data = await updateLineItem(changedFields, lineItemDetails?.id!);
      if (data?.data) {
        navigate('/campaign-management/line-items');
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    navigate(`/campaign-management/line-items`);
  };

  return (
    <Form
      form={form}
      layout='vertical'
      onValuesChange={handleValuesChange}
      onFinish={handleSubmit}>
      <Row
        gutter={16}
        justify='start'
        style={{ paddingLeft: '0.5rem', marginBottom: '2rem' }}>
        <Text
          style={{
            color: '#464343',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          {t('pages.lineItems.label.customQuestions')}
        </Text>
      </Row>

      <Form.Item>
        <Checkbox checked={hasCustomQuestions} onChange={handleCheckboxChange}>
          Custom Questions?
        </Checkbox>
      </Form.Item>

      {instructionField && (
        <Form.Item
          key={instructionField.field}
          label={instructionField.label}
          name={instructionField.field}
          className='input-control form-control-item'>
          <Input.TextArea
            disabled={!hasCustomQuestions}
            maxLength={instructionField.maxLength}
            placeholder={instructionField.label}
            className='input-field'
          />
        </Form.Item>
      )}

      {hasCustomQuestions && (
        <>
          <CustomQuestions
            form={form}
            key='customQuestions'
            customProps={{
              childrenFields: customQuestionsField?.childrenFields || [],
              disabled: false,
            }}
          />
          {addQuestionError && (
            <Flex style={{ color: '#ff602e', marginTop: '0.5rem' }}>
              This field is required.
            </Flex>
          )}
        </>
      )}

      {additionalInstructionsField && (
        <Form.Item
          key={additionalInstructionsField.field}
          label={additionalInstructionsField.label}
          name={additionalInstructionsField.field}
          className='input-control form-control-item'>
          <Input.TextArea
            maxLength={additionalInstructionsField.maxLength}
            placeholder={additionalInstructionsField.label}
            className='input-field'
          />
        </Form.Item>
      )}

      <Flex
        justify='end'
        gap='0.5rem'
        style={{ marginBottom: '3rem', marginRight: '2rem' }}>
        <Button onClick={handleCancel}>Cancel</Button>
        {loading ? (
          <LoaderButton style={{ width: '9.5rem' }} />
        ) : (
          <Button htmlType='submit' type='primary'>
            Done
          </Button>
        )}
      </Flex>
    </Form>
  );
};
