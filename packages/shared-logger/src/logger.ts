import type { LogLevel, LogEntry } from './types';

const FLUSH_INTERVAL_MS = 10_000;
const BATCH_SIZE_THRESHOLD = 20;

export class Logger {
  private app: string;
  private buffer: LogEntry[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private logEndpoint: string | undefined;
  private getUserId: (() => string | undefined) | undefined;

  constructor(
    app: string,
    options?: {
      logEndpoint?: string;
      getUserId?: () => string | undefined;
    },
  ) {
    this.app = app;
    this.logEndpoint = options?.logEndpoint;
    this.getUserId = options?.getUserId;

    if (typeof window !== 'undefined') {
      this.flushTimer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS);
    }
  }

  private enqueue(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      app: this.app,
      userId: this.getUserId?.(),
      metadata,
    };

    this.buffer.push(entry);

    if (this.buffer.length >= BATCH_SIZE_THRESHOLD) {
      this.flush();
    }
  }

  private async flush() {
    if (!this.buffer.length || !this.logEndpoint) return;

    const batch = [...this.buffer];
    this.buffer = [];

    try {
      await fetch(this.logEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch),
      });
    } catch {
      // Silent fail — logging should never break the app
    }
  }

  debug = (msg: string, meta?: Record<string, unknown>) => {
    if (import.meta.env?.DEV) console.debug(`[${this.app}]`, msg, meta ?? '');
    this.enqueue('debug', msg, meta);
  };

  info = (msg: string, meta?: Record<string, unknown>) => {
    if (import.meta.env?.DEV) console.info(`[${this.app}]`, msg, meta ?? '');
    this.enqueue('info', msg, meta);
  };

  warn = (msg: string, meta?: Record<string, unknown>) => {
    if (import.meta.env?.DEV) console.warn(`[${this.app}]`, msg, meta ?? '');
    this.enqueue('warn', msg, meta);
  };

  error = (msg: string, meta?: Record<string, unknown>) => {
    if (import.meta.env?.DEV) console.error(`[${this.app}]`, msg, meta ?? '');
    this.enqueue('error', msg, meta);
  };

  logError = (error: unknown) => {
    const msg = error instanceof Error ? error.message : String(error);
    if (import.meta.env?.DEV) console.error(`[${this.app}]`, error);
    this.enqueue('error', msg, {
      stack: error instanceof Error ? error.stack : undefined,
    });
  };

  logHttpRequest = (data: Record<string, unknown>, isError = false) => {
    if (import.meta.env?.DEV) {
      console[isError ? 'error' : 'log'](`[${this.app}:http]`, data);
    }
    this.enqueue(isError ? 'error' : 'info', `HTTP ${isError ? 'Error' : 'Request'}`, data);
  };

  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush();
  }
}

export const createLogger = (
  app: string,
  options?: {
    logEndpoint?: string;
    getUserId?: () => string | undefined;
  },
) => new Logger(app, options);
