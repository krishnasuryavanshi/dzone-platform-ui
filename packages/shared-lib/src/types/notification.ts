export interface OpenNotificationParams {
  key?: string;
  message: string;
  type: 'success' | 'error' | 'progress';
  description?: string;
  cancelMutation?: () => void;
  undoableTimeout?: number;
  placement?: 'top' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  className?: string;
}

export interface INotificationContext {
  open?: (params: OpenNotificationParams) => void;
  close?: (key: string) => void;
}

export type NotificationProvider = Required<INotificationContext>;
