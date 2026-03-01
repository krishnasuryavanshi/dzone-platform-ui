export interface IPacingChartType {
  date: string;
  dayOfAWeek: string;
  leadsRequired: number;
}

export interface IPacingRequestData {
  leadGoal: number;
  targetStartDate: string;
  targetEndDate: string;
  selectedPacing: string;
}
