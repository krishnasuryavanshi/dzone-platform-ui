interface ITrackingData {
  trackingId: string;
  fields: {
    key: string;
    value: string;
  }[];
}

export interface IValidateLeads {
  lineItemId: string;
  totalLeads: number;
  leadStatus: string[];
  validationStatus: string[];
  leadInfo: ITrackingData[];
  isSanitationSystem: boolean;
}
