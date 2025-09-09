// Type definition for the log event function
type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogCategory = 'frontend' | 'backend';

// Log event function that matches the external logger's interface
export const logEvent = (level: LogLevel, category: LogCategory, data: any) => {
  // In a real implementation, this would send logs to a backend service
  // For now, we'll just console.log with proper formatting
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${category}:`, data);
};

// Constants for validation
export const VALID_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export const VALID_CATEGORIES = ['frontend', 'backend'] as const;
