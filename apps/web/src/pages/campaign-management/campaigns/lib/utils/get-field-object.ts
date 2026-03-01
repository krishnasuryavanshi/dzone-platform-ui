import { find } from 'lodash-es';

export function getFieldObject(
  list: any,
  property: string,
  fieldName: string
) {
  for (const section of list) {
    const field = find(section.fields, { [property]: fieldName });
    if (field) {
      return field;
    }
  }
}
