import { FieldType } from '@dzone/shared-lib';
import { omitBy, pick } from 'lodash-es';
import { validationRules } from '../../../lib/utils';

export const prepareField = (
  rawField: any,
  lists: any,
  transKey: string,
  createPermissionKey: boolean,
  editPermissionKey: boolean,
  viewPermissionKey?: boolean,
  _entityId?: string,
) => {
  if (viewPermissionKey === false) {
    return null;
  }
  let inputProps: any = pick(rawField, [
    'filterOption',
    'disabled',
    'format',
    'onChange',
    'onBlur',
    'onSelect',
    'uploadProps',
    'uploadLabel',
    'uploading',
    'maxLength',
    'min',
    'options',
    // for file upload only
    'afterContent',
    'afterContentProps',
    'hasMultiselectSearch',
    'layout',
    // for file upload only
    'beforeContent',
    'inputContainerStyles',
  ]);
  inputProps = omitBy(inputProps, (v) => v === undefined);

  let itemProps: any = pick(rawField, [
    'columnSpan',
    'hidden',
    'valuePropName',
    'customHelpText',
    'showLabelInControl',
  ]);
  itemProps = omitBy(itemProps, (v) => v === undefined);

  const field: any = {
    item: {
      name: rawField.name || rawField.field,
      ...itemProps,
    },
    input: {
      type: rawField.fieldType,
      placeholder: `${transKey}.${rawField.field}.placeholder`,
      ...inputProps,
    },
  };

  const rules = validationRules(rawField.rules, rawField.field, transKey);
  if (rules?.length) {
    field.item.rules = rules;
  }

  if (rawField?.showLabel !== false) {
    field.item.label = `${transKey}.${rawField.field}.label`;
  }

  if (lists[rawField.optionsKey]) {
    field.input.options = lists[rawField.optionsKey];
  }

  if (rawField.fieldType === FieldType.CustomComponent) {
    field.component = rawField.component;
    field.customProps = {
      transKey,
      lists,
      maxAllowedCount: rawField.maxAllowedCount,
    };

    if (rawField?.children?.length) {
      field.customProps = {
        ...field.customProps,
        childrenFields: rawField.children,
      };
    }
  }

  if (viewPermissionKey && !createPermissionKey) {
    field.input.disabled = field.input.disabled;
  }

  if (viewPermissionKey && !editPermissionKey) {
    field.input.disabled = field.input.disabled;
  }
  return field;
};
