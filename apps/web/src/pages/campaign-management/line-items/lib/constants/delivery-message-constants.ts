export const templateSelectedSuccessMessage = (templateName?: string) => {
  return `${templateName!} successfully selected for lead transformation.`;
};

export const EXPORT_INFO_MESSAGE =
  'Any lead that does not have the required data, will not be exported.';

export const SUCCESS_HEADER_MESSAGE = 'The Export Started';

export const TRANSFORM_AND_EXPORT_SUCCESS_MESSAGE =
  'Check the download section of your browser in a few minutes.';

export const FAILURE_HEADER_MESSAGE = 'Oops! Export Failed';

export const TRANSFORM_AND_EXPORT_FAILURE_MESSAGE = `Looks like something went wrong with your export. Don't worry, you can give it another shot!`;

export const EXCEEDED_HEADER_MESSAGE = 'Whoa! Too Many Leads!';

export const TRANSFORM_AND_EXPORT_EXCEEDED_MESSAGE =
  'Your export exceeds the maximum size of 500,000 records. Adjust the filters and try again.';
