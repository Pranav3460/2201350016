import { logEvent } from "./logEvent";

export class Logger {
  private static formatMessage(message: string, data?: any): string {
    return data ? `${message} ${JSON.stringify(data)}` : message;
  }

  static info(context: string, message: string, data?: any) {
    logEvent('info', 'frontend', {
      context,
      message: this.formatMessage(message, data),
      timestamp: new Date().toISOString()
    });
  }

  static error(context: string, message: string, data?: any) {
    logEvent('error', 'frontend', {
      context,
      message: this.formatMessage(message, data),
      timestamp: new Date().toISOString()
    });
  }

  static warn(context: string, message: string, data?: any) {
    logEvent('warn', 'frontend', {
      context,
      message: this.formatMessage(message, data),
      timestamp: new Date().toISOString()
    });
  }

  static debug(context: string, message: string, data?: any) {
    logEvent('debug', 'frontend', {
      context,
      message: this.formatMessage(message, data),
      timestamp: new Date().toISOString()
    });
  }
}
