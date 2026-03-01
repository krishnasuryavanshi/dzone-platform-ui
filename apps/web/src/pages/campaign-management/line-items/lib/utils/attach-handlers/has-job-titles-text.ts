import { LineItemFileUploadMap } from '../../constants';
import { LineItemFields, LineItemSections } from '../../enums';
import { updateUploadField } from '../setup-initial-states';

export const hasJobTitlesText = (
  patchFormValues: Function,
  updateFormStepDetails: Function,
  showSaveAndCloseButtonIfFileChanged: (val: boolean) => void,
) => {
  const onChange = (jobTitles: Record<string, any>[]) => {
    const shouldFileUploadButtonEnabled = !jobTitles?.length;

    const fieldMap =
      LineItemFileUploadMap[
        LineItemFields.JobTitleListUpload as keyof typeof LineItemFileUploadMap
      ];
    updateUploadField(
      shouldFileUploadButtonEnabled,
      patchFormValues,
      updateFormStepDetails,
      fieldMap,
      showSaveAndCloseButtonIfFileChanged,
    );
  };

  updateFormStepDetails(
    LineItemSections.JobTitleDetails,
    LineItemFields.JobTitles,
    { onChange },
  );
};
