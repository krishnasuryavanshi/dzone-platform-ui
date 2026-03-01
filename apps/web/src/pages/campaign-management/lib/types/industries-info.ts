export interface IIndustries {
  name: string;
  value: string;
  industries: ISubIndustries[];
}

export interface ISubIndustries {
  name: string;
  value: string;
  description: string;
  type: string;
}
