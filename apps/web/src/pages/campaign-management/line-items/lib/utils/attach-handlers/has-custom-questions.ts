import { LineItemFields, LineItemSections } from '../../enums';
import { updateCustomQuestionsField } from '../setup-initial-states';

export const attachHasCustomQuestionsFieldHandler = (
  patchFormValues: Function,
  updateFormStepDetails: Function,
) => {
  const onChange = async (e: any) => {
    patchFormValues({
      [LineItemFields.HasCustomQuestions]: e.target.checked,
    });

    updateCustomQuestionsField(
      e.target.checked,
      patchFormValues,
      updateFormStepDetails,
    );
  };

  updateFormStepDetails(
    LineItemSections.CustomQuestions,
    LineItemFields.HasCustomQuestions,
    { onChange },
  );
};
