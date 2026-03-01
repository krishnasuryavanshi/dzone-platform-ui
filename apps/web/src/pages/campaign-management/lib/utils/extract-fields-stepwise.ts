export const extractFieldsStepwise = (storage: string) => {
  try {
    const stored = sessionStorage.getItem(storage);
    if (!stored) return [];
    const stepData = JSON.parse(stored);
    const stepFields = Object.values(stepData.steps || {}).map((val: any) => val.fields);
    return stepFields;
  } catch {
    return [];
  }
};
