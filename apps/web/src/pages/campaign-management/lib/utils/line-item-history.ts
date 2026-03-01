import { VALIDATION_LABEL_MAP } from '../constants';

export const buildFieldLabelMap = (
  formConfig: any[],
): Record<string, string> => {
  const map: Record<string, string> = {};

  formConfig.forEach((field) => {
    if (field.field && field.label) {
      map[`lineItem.${field.field}`] = field.label;
      map[field.field] = field.label;
      map[`validationSetting.${field.field}`] = field.label;
    }
  });

  return map;
};

function getValidationLabel(name: string): string {
  if (name.startsWith('validationSetting.')) {
    const parts = name.split('.');
    if (parts.length === 3) {
      const category = VALIDATION_LABEL_MAP[parts[1]] || parts[1];
      let field = parts[2];

      if (field === 'ENTITY_LEVEL') {
        field = 'Entity Level';
      } else if (field === 'ACCOUNT_LEVEL') {
        field = 'Account Level';
      } else if (field === 'DUPLICATE_VALIDATION_FIELDS') {
        field = 'Duplicate Validation Fields';
      } else if (field === 'LOOPBACK_PERIOD') {
        field = 'Loopback Period';
      } else {
        field = field
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (s) => s.toUpperCase());
      }

      return `Validation Settings > ${category} > ${field}`;
    }
    if (parts.length === 2) {
      let category = VALIDATION_LABEL_MAP[parts[1]] || parts[1];

      if (/^[A-Z_]+$/.test(category)) {
        category = category
          .replace(/_/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }

      return `Validation Settings > ${category}`;
    }
  }
  return name;
}

export const getReadableHistory = (history: any[], formConfig: any[]) => {
  const labelMap = buildFieldLabelMap(formConfig);

  return history.map((entry) => ({
    ...entry,
    diff: entry.diff.map((change: any) => {
      let label = labelMap[change.name] || change.name;
      if (change.name.startsWith('validationSetting.')) {
        label = getValidationLabel(change.name);
      }
      return {
        ...change,
        label,
      };
    }),
  }));
};
