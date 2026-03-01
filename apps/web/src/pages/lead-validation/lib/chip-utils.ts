/**
 * Utility functions for chip input components
 */

export const CHIP_DELIMITERS = /[,\t\n;]/;

/** Split input text by delimiters and return cleaned values. */
export const splitChipValues = (input: string): string[] => {
  return input
    .split(CHIP_DELIMITERS)
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
};

/** Check if input contains any delimiter characters. */
export const containsDelimiter = (input: string): boolean => {
  return CHIP_DELIMITERS.test(input);
};

/**
 * Validate chip input against allowed characters.
 * Only letters, numbers, spaces, "&" and "-" are allowed.
 */
export const validateChipValue = (input: string): boolean => {
  const trimmed = input.trim().replace(/\s+/g, ' ');
  if (!trimmed) return false;
  const regex = /^[A-Za-z0-9\s&-]+$/;
  return regex.test(trimmed);
};

/**
 * Process input value and extract chips.
 * Returns new values, duplicates, invalid values, and remaining input.
 */
export const processChipInput = (
  input: string,
  existingValues: string[] = [],
): {
  newValues: string[];
  duplicates: string[];
  invalidValues: string[];
  remainingInput: string;
} => {
  if (!containsDelimiter(input)) {
    const invalid = validateChipValue(input) ? [] : [input];
    return {
      newValues: [],
      duplicates: [],
      invalidValues: invalid,
      remainingInput: input,
    };
  }

  const values = splitChipValues(input);
  const newValues: string[] = [];
  const duplicates: string[] = [];
  const invalidValues: string[] = [];
  let remainingInput = '';

  const normalizedExisting = existingValues.map((v) => v.toLowerCase());
  const endsWithDelimiter = CHIP_DELIMITERS.test(input[input.length - 1] || '');

  values.forEach((value, index) => {
    const normalizedValue = value.toLowerCase();
    const isLastValue = index === values.length - 1;

    if (!validateChipValue(value)) {
      invalidValues.push(value);
    } else if (isLastValue && !endsWithDelimiter) {
      remainingInput = value;
    } else if (
      !normalizedExisting.includes(normalizedValue) &&
      !newValues.some((v) => v.toLowerCase() === normalizedValue)
    ) {
      newValues.push(value);
    } else if (!duplicates.includes(value)) {
      duplicates.push(value);
    }
  });

  return { newValues, duplicates, invalidValues, remainingInput };
};

/** Process pasted text for chip creation. */
export const processPastedText = (
  pastedText: string,
  existingValues: string[] = [],
): {
  newValues: string[];
  duplicates: string[];
  invalidValues: string[];
} => {
  const values = splitChipValues(pastedText);
  const newValues: string[] = [];
  const duplicates: string[] = [];
  const invalidValues: string[] = [];
  const normalizedExisting = existingValues.map((v) => v.toLowerCase());

  values.forEach((value) => {
    const normalizedValue = value.toLowerCase();

    if (!validateChipValue(value)) {
      invalidValues.push(value);
    } else if (
      !normalizedExisting.includes(normalizedValue) &&
      !newValues.some((v) => v.toLowerCase() === normalizedValue)
    ) {
      newValues.push(value);
    } else if (!duplicates.includes(value)) {
      duplicates.push(value);
    }
  });

  return { newValues, duplicates, invalidValues };
};

/** Handle keyboard events for chip creation. */
export const shouldCreateChip = (key: string): boolean => {
  return key === 'Enter' || key === 'Tab';
};
