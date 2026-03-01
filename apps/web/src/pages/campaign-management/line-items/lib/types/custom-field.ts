export interface ICustomField {
  id: string;
  position: number;
  label: string;
  name: string;
  type: string;
  format?: string;
  required: boolean;
  inclusion: string | null;
  exclusion: string | null;
}
