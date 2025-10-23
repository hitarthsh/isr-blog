interface LogLevel {
  ERROR: 0;
  WARN: 1;
  INFO: 2;
  DEBUG: 3;
}

const LOG_LEVELS: LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const LOG_LEVEL_NAMES = ['ERROR', 'WARN', 'INFO', 'DEBUG'] as const;

type LogLevelName = keyof LogLevel;

interface LogEntry {
  timestamp: string;
  level: LogLevelName;
  message: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  requestId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  method?: string;
}

class Logger {
  private currentLevel: number;
  private isDevelopment: boolean;

  constructor() {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase() as LogLevelName;
    this.currentLevel = LOG_LEVELS[envLevel] ?? LOG_LEVELS.INFO;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private shouldLog(level: LogLevelName): boolean {
    return LOG_LEVELS[level] <= this.currentLevel;
  }

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, error, requestId, userId, ip, userAgent, url, method } = entry;
    
    let logMessage = `[${timestamp}] ${level}: ${message}`;
    
    if (requestId) logMessage += ` [RequestId: ${requestId}]`;
    if (userId) logMessage += ` [UserId: ${userId}]`;
    if (ip) logMessage += ` [IP: ${ip}]`;
    if (method && url) logMessage += ` [${method} ${url}]`;
    if (userAgent) logMessage += ` [UserAgent: ${userAgent}]`;
    
    if (context && Object.keys(context).length > 0) {
      logMessage += ` [Context: ${JSON.stringify(context)}]`;
    }
    
    if (error) {
      logMessage += ` [Error: ${error.name}: ${error.message}]`;
      if (error.stack && this.isDevelopment) {
        logMessage += `\nStack: ${error.stack}`;
      }
    }
    
    return logMessage;
  }

  private log(level: LogLevelName, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    };

    const formattedLog = this.formatLog(entry);

    // In development, use console with colors
    if (this.isDevelopment) {
      const colors = {
        ERROR: '\x1b[31m', // Red
        WARN: '\x1b[33m',  // Yellow
        INFO: '\x1b[36m',  // Cyan
        DEBUG: '\x1b[90m', // Gray
      };
      const reset = '\x1b[0m';
      console.log(`${colors[level]}${formattedLog}${reset}`);
    } else {
      // In production, use structured logging
      console.log(JSON.stringify(entry));
    }

    // Send to external logging service if configured
    if (process.env.SENTRY_DSN && level === 'ERROR') {
      this.sendToSentry(entry);
    }
  }

  private async sendToSentry(entry: LogEntry): Promise<void> {
    try {
      // This would integrate with Sentry or another logging service
      // For now, we'll just log that we would send it
      if (this.isDevelopment) {
        console.log('Would send to Sentry:', entry);
      }
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    this.log('ERROR', message, context, error);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('WARN', message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('INFO', message, context);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('DEBUG', message, context);
  }

  // Request-specific logging
  logRequest(request: Request, response?: Response, error?: Error): void {
    const url = new URL(request.url);
    const context = {
      method: request.method,
      url: url.pathname,
      query: Object.fromEntries(url.searchParams),
      status: response?.status,
      responseTime: response ? Date.now() - Date.now() : undefined,
    };

    if (error) {
      this.error(`Request failed: ${request.method} ${url.pathname}`, context, error);
    } else {
      this.info(`Request: ${request.method} ${url.pathname}`, context);
    }
  }

  // Performance logging
  logPerformance(operation: string, duration: number, context?: Record<string, any>): void {
    this.info(`Performance: ${operation} took ${duration}ms`, {
      operation,
      duration,
      ...context,
    });
  }

  // Security logging
  logSecurity(event: string, context?: Record<string, any>): void {
    this.warn(`Security: ${event}`, {
      event,
      ...context,
    });
  }
}

// Create singleton instance
export const logger = new Logger();

// Export types for use in other files
export type { LogEntry, LogLevelName };
