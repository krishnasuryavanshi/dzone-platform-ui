export interface IShowItemFieldsProps {
  itemDetails?: Record<string, any>;
  formConfig: any;
  isCollapsed: boolean;
  summaryViewFields: string[];
}

export interface IShowItemDetailsProps extends IShowItemFieldsProps {
  updateUrl: string;
  stepCount: number;
  pageLabel: string;
  type: 'lineItem' | 'campaign';
}
