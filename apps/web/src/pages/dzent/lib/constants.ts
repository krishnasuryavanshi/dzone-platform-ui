import { SystemMessageActionsEnum } from './enums';

export const DefaultTextFieldName = 'UserInputText';
export const DefaultFileUploadFieldName = 'UserInputFiles';

export const NoFormActionTypes = [
  SystemMessageActionsEnum.Text,
  SystemMessageActionsEnum.Number,
  SystemMessageActionsEnum.Actions,
];
