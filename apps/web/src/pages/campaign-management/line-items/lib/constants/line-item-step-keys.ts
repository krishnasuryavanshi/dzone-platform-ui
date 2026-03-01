import { LineItemSteps, StepKeys } from '../enums';

const StepKeysList: Record<LineItemSteps, string> = {
  [LineItemSteps.BasicDetails]: StepKeys.BasicDetails,
  [LineItemSteps.Goals]: StepKeys.Goals,
  [LineItemSteps.DeliveryAndPacing]: StepKeys.DeliveryAndPacing,
  [LineItemSteps.CustomQuestions]: StepKeys.CustomQuestions,
  [LineItemSteps.Targeting]: StepKeys.Targeting,
};

export { StepKeysList };
