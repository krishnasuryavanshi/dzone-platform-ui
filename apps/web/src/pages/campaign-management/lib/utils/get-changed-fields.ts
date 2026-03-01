import { formatDate } from '@dzone/shared-lib';
import { dateFields, CAMPAIGN_FORM_FIELDS } from '../constants';
import { CampaignField } from '../../campaigns/lib/enums';

export const getChangedFields = (initial: any, current: any) => {
  const cleanedInitial = Object.fromEntries(
    Object.entries(initial || {}).filter(([key]) =>
      CAMPAIGN_FORM_FIELDS.includes(key as CampaignField),
    ),
  );
  const cleanedCurrent = Object.fromEntries(
    Object.entries(current || {}).filter(([key]) =>
      CAMPAIGN_FORM_FIELDS.includes(key as CampaignField),
    ),
  );

  const changedFields: any = {};

  for (const key of Object.keys(cleanedCurrent)) {
    if (dateFields.includes(key as CampaignField)) {
      const formattedInitial = formatDate(cleanedInitial[key]);
      const formattedCurrent = formatDate(cleanedCurrent[key]);

      if (formattedInitial !== formattedCurrent) {
        changedFields[key] = formattedCurrent;
      }
    } else if (key === 'ioFileId') {
      const getId = (val: any) =>
        typeof val === 'object' && val !== null ? val.id : val;

      const initialId = getId(cleanedInitial[key]);
      const currentId = getId(cleanedCurrent[key]);

      if (initialId !== currentId) {
        changedFields['ioFileId'] = currentId === undefined ? null : currentId;
      }
    } else if (
      JSON.stringify(cleanedInitial[key]) !==
      JSON.stringify(cleanedCurrent[key])
    ) {
      changedFields[key] = cleanedCurrent[key];
    }
  }

  return changedFields;
};
