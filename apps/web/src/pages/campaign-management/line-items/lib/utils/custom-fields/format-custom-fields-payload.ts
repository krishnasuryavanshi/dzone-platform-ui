const generateNameFromLabel = (label: string): string => {
  // Convert to lowercase, replace spaces/special chars with underscores
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
};

export const formatCustomFieldsPayload = (values: Record<string, any>) => {
  // Extract customFields array and customFieldInstructions from form values
  const { customFields, customFieldInstructions } = values;

  // Clean and validate customFields array
  const cleanedFields = customFields?.map((field: Record<string, any>, index: number) => {
    // Convert arrays to comma-separated strings
    const inclusionArray = field.inclusion || [];
    const exclusionArray = field.exclusion || [];

    const inclusionString = Array.isArray(inclusionArray)
      ? inclusionArray.join(',')
      : null;
    const exclusionString = Array.isArray(exclusionArray)
      ? exclusionArray.join(',')
      : null;

    return {
      position: index + 1,
      name: field.name ? field.name : generateNameFromLabel(field.label),
      label: field.label,
      type: field.type,
      format: field.type === 'Date' ? field.format : null,
      required: field.required || false,
      inclusion: inclusionString,
      exclusion: exclusionString,
    };
  });

  const payload = {
    customFields: cleanedFields,
    customFieldInstructions: customFieldInstructions,
  };
  return payload;
};
