export interface IDialogState {
  isDialogOpen: boolean;
  dialogType: 'Progress' | 'Success' | 'Error';
  progress: number;
  message: string;
  info?: Record<string, string | number | boolean>;
}
