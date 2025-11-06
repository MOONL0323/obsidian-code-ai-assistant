// 简化的日志工具

export enum LogLevel {
    Debug = 0,
    Info = 1,
    Warn = 2,
    Error = 3,
    Off = 4,
}

export interface ILogger {
    debug(message: unknown, ...args: unknown[]): void;
    info(message: unknown, ...args: unknown[]): void;
    warn(message: unknown, ...args: unknown[]): void;
    error(message: unknown, ...args: unknown[]): void;
}

class Logger implements ILogger {
    constructor(private name: string) {}

    private formatMessage(level: string, message: unknown, ...args: unknown[]): void {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level}] [${this.name}]`;
        
        if (typeof message === 'string') {
            console.log(prefix, message, ...args);
        } else {
            console.log(prefix, message, ...args);
        }
    }

    debug(message: unknown, ...args: unknown[]): void {
        this.formatMessage('DEBUG', message, ...args);
    }

    info(message: unknown, ...args: unknown[]): void {
        this.formatMessage('INFO', message, ...args);
    }

    warn(message: unknown, ...args: unknown[]): void {
        this.formatMessage('WARN', message, ...args);
    }

    error(message: unknown, ...args: unknown[]): void {
        this.formatMessage('ERROR', message, ...args);
    }

    log(message: string, ...args: unknown[]): void {
        this.info(message, ...args);
    }

    logError(message: string, error?: unknown): void {
        if (error) {
            this.error(message, error);
        } else {
            this.error(message);
        }
    }

    logWarn(message: string, ...args: unknown[]): void {
        this.warn(message, ...args);
    }
}

// 创建 logger 工厂函数
export function createLogger(name: string): Logger {
    return new Logger(name);
}

// 导出一个默认的 logger 实例供兼容性使用
export const logger = createLogger('default');
