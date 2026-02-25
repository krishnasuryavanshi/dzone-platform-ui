export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  app: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}
