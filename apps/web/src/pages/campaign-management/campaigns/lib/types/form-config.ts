export interface ILineItemField {
  field: string;
  fieldType: string;
  rules: { required: boolean }[];
  disabled: boolean;
  dataIndex: string;
  columnMetadata: any;
  columnOrder: number;
}
