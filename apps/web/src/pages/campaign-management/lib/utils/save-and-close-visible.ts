export const isSaveAndCloseVisible = (
  existingFormDetails: Record<string, any> | undefined,
  step: number
) => {
  const isVisible =
    !existingFormDetails?.id ||
    !(step <= existingFormDetails?.finishedStepId);
  return isVisible;
};
