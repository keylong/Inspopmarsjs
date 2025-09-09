/**
 * 结构化日志记录工具
 * Structured logging utility with multiple output targets
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  sessionId?: string;
  requestId?: string;
}

class Logger {
  private minLevel: LogLevel;
  private outputs: Array<(entry: LogEntry) => void> = [];

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
    
    // 添加控制台输出
    this.addOutput(this.consoleOutput.bind(this));
    
    // 如果在浏览器中，添加远程日志输出
    if (typeof window !== 'undefined') {
      this.addOutput(this.remoteOutput.bind(this));
    }
  }

  addOutput(outputFn: (entry: LogEntry) => void) {
    this.outputs.push(outputFn);
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    const userId = this.getCurrentUserId();
    const sessionId = this.getSessionId();
    const requestId = this.getRequestId();
    
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context && { context }),
      ...(error && { error }),
      ...(userId && { userId }),
      ...(sessionId && { sessionId }),
      ...(requestId && { requestId }),
    };
  }

  private getCurrentUserId(): string | undefined {
    // 尝试从各种来源获取用户 ID
    if (typeof window !== 'undefined') {
      // 从 localStorage 或 sessionStorage 获取
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsed = JSON.parse(userData);
          return parsed.id;
        }
      } catch {
        // 忽略解析错误
      }
    }
    return undefined;
  }

  private getSessionId(): string | undefined {
    if (typeof window !== 'undefined') {
      // 生成或获取会话 ID
      let sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('sessionId', sessionId);
      }
      return sessionId;
    }
    return undefined;
  }

  private getRequestId(): string | undefined {
    // 在服务器端可以从请求头中获取
    return undefined;
  }

  private consoleOutput(entry: LogEntry) {
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
    const levelColors = [
      '\x1b[36m', // cyan
      '\x1b[32m', // green
      '\x1b[33m', // yellow
      '\x1b[31m', // red
      '\x1b[35m', // magenta
    ];
    const reset = '\x1b[0m';
    
    const color = levelColors[entry.level] || '';
    const levelName = levelNames[entry.level] || 'UNKNOWN';
    
    const logMessage = `${color}[${entry.timestamp}] ${levelName}${reset}: ${entry.message}`;
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, entry.context);
        break;
      case LogLevel.INFO:
        console.info(logMessage, entry.context);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, entry.context);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(logMessage, entry.context, entry.error);
        break;
      default:
        console.log(logMessage, entry.context);
    }
  }

  private async remoteOutput(entry: LogEntry) {
    // 只在生产环境发送远程日志
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // 只发送 WARN 及以上级别的日志到远程
    if (entry.level < LogLevel.WARN) {
      return;
    }

    try {
      await fetch('/api/monitoring/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...entry,
          error: entry.error ? {
            message: entry.error.message,
            stack: entry.error.stack,
            name: entry.error.name,
          } : undefined,
        }),
      });
    } catch (error) {
      // 如果远程日志失败，至少输出到控制台
      console.error('Failed to send remote log:', error);
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.createLogEntry(level, message, context, error);
    
    this.outputs.forEach(output => {
      try {
        output(entry);
      } catch (outputError) {
        console.error('Log output failed:', outputError);
      }
    });
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  fatal(message: string, error?: Error, context?: Record<string, any>) {
    this.log(LogLevel.FATAL, message, context, error);
  }

  // 特定用途的日志方法
  apiCall(method: string, url: string, duration?: number, status?: number) {
    this.info('API Call', {
      method,
      url,
      duration,
      status,
      category: 'api',
    });
  }

  userAction(action: string, details?: Record<string, any>) {
    this.info('User Action', {
      action,
      ...details,
      category: 'user',
    });
  }

  performance(metric: string, value: number, unit: string = 'ms') {
    this.info('Performance Metric', {
      metric,
      value,
      unit,
      category: 'performance',
    });
  }

  security(event: string, details?: Record<string, any>) {
    this.warn('Security Event', {
      event,
      ...details,
      category: 'security',
    });
  }
}

// 创建全局日志实例
const logger = new Logger(
  process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
);

export default logger;

// 便捷导出
export const log = logger;