import { FormInstance } from 'antd';
import { LineItemFields, LineItemSections } from '../../enums';
import { fetchLineItemFormCustomQuestionSetNumber } from '../../../services';

export const setupCustomQuestionsFieldInitialState = async (
  form: FormInstance<any>,
  patchFormValues: Function,
  updateFormStepDetails: Function,
) => {
  const hasCustomQuestions = !!form.getFieldValue(
    LineItemFields.HasCustomQuestions,
  );

  updateCustomQuestionsField(
    hasCustomQuestions,
    patchFormValues,
    updateFormStepDetails,
  );
};

export const updateCustomQuestionsField = async (
  hasCustomQuestions: boolean,
  patchFormValues: Function,
  updateFormStepDetails: Function,
) => {
  let props = {
    disabled: !hasCustomQuestions,
    rules: [{ required: hasCustomQuestions }],
    maxAllowedCount: 0,
  };

  if (hasCustomQuestions) {
    const { data } = await fetchLineItemFormCustomQuestionSetNumber();
    props.maxAllowedCount = data?.maxSetOfQuestions;
  } else {
    patchFormValues({
      [LineItemFields.CustomQuestions]: [],
    });
    patchFormValues({
      [LineItemFields.CustomQuestionInstructions]: null,
    });
  }

  updateFormStepDetails(
    LineItemSections.CustomQuestions,
    LineItemFields.CustomQuestionInstructions,
    { disabled: !hasCustomQuestions },
  );

  updateFormStepDetails(
    LineItemSections.CustomQuestions,
    LineItemFields.CustomQuestions,
    props,
  );
};
