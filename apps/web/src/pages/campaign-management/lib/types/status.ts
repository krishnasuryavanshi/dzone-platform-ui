export interface IStatus {
  name: string;
  value: string;
  type?: 'promotion' | 'demotion';
  title?: string;
  description?: string;
  positiveMessage?: string;
  negativeMessage?: string;
}
