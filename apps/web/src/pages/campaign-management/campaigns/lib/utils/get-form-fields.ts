import { cloneDeep } from 'lodash-es';
import { CampaignStep } from '../enums';

export const getFormFields = (
  step: CampaignStep | number,
  config: any,
  options?: Record<string, any>,
) => {
  if (!(step >= 0)) return;
  const { meta, translation, steps } = config;
  const sections =
    (steps &&
      steps[step as keyof typeof steps]?.map((section: Record<string, any>) => {
        section.fields = section.fields.filter(
          (field: Record<string, any>) => field.fieldType,
        );
        section.fields.forEach((field: Record<string, any>) => {
          const isHiddenField = options?.hiddenFields?.includes(field.field);

          if (isHiddenField) {
            field.hidden = true;
          }
        });
        return section;
      })) ||
    [];

  const fields = cloneDeep({
    step: sections,
    meta: { ...meta, layout: meta.formLayout },
    translation,
  });
  return { ...fields };
};
