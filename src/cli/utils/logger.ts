import chalk from 'chalk';
import ora, { Ora } from 'ora';

export type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';

export interface LoggerOptions {
  verbose?: boolean;
  silent?: boolean;
}

/**
 * Enhanced logger with colors, spinners, and formatting
 */
export class Logger {
  private options: LoggerOptions;
  private spinner: Ora | null = null;

  constructor(options: LoggerOptions = {}) {
    this.options = options;
  }

  /**
   * Log info message
   */
  info(message: string, ...args: any[]) {
    if (this.options.silent) return;
    console.log(chalk.blue('ℹ'), message, ...args);
  }

  /**
   * Log success message
   */
  success(message: string, ...args: any[]) {
    if (this.options.silent) return;
    console.log(chalk.green('✅'), message, ...args);
  }

  /**
   * Log warning message
   */
  warn(message: string, ...args: any[]) {
    if (this.options.silent) return;
    console.log(chalk.yellow('⚠️'), message, ...args);
  }

  /**
   * Log error message
   */
  error(message: string, ...args: any[]) {
    console.error(chalk.red('❌'), message, ...args);
  }

  /**
   * Log debug message (only in verbose mode)
   */
  debug(message: string, ...args: any[]) {
    if (this.options.silent || !this.options.verbose) return;
    console.log(chalk.gray('🐛'), chalk.gray(message), ...args);
  }

  /**
   * Start a spinner with message
   */
  startSpinner(message: string) {
    if (this.options.silent) return;
    this.spinner = ora({
      text: message,
      color: 'cyan',
      spinner: 'dots'
    }).start();
    return this.spinner;
  }

  /**
   * Update spinner text
   */
  updateSpinner(message: string) {
    if (this.spinner) {
      this.spinner.text = message;
    }
  }

  /**
   * Stop spinner with success
   */
  stopSpinner(message?: string) {
    if (this.spinner) {
      this.spinner.succeed(message);
      this.spinner = null;
    }
  }

  /**
   * Stop spinner with error
   */
  failSpinner(message?: string) {
    if (this.spinner) {
      this.spinner.fail(message);
      this.spinner = null;
    }
  }

  /**
   * Log a section header
   */
  section(title: string) {
    if (this.options.silent) return;
    console.log('\n' + chalk.bold.cyan(`═══ ${title} ═══`));
  }

  /**
   * Log a step in a process
   */
  step(step: number, total: number, message: string) {
    if (this.options.silent) return;
    const progress = chalk.gray(`[${step}/${total}]`);
    console.log(`${progress} ${message}`);
  }

  /**
   * Display a table
   */
  table(data: Record<string, any>[]) {
    if (this.options.silent || data.length === 0) return;
    
    console.table(data);
  }

  /**
   * Display a key-value list
   */
  keyValue(data: Record<string, any>) {
    if (this.options.silent) return;
    
    Object.entries(data).forEach(([key, value]) => {
      const formattedKey = chalk.cyan(key.padEnd(20));
      const formattedValue = typeof value === 'string' ? value : JSON.stringify(value);
      console.log(`  ${formattedKey} ${formattedValue}`);
    });
  }

  /**
   * Display a progress bar
   */
  progress(current: number, total: number, message = '') {
    if (this.options.silent) return;
    
    const percentage = Math.round((current / total) * 100);
    const barLength = 30;
    const filledLength = Math.round((percentage / 100) * barLength);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    
    process.stdout.write(`\r${message} ${bar} ${percentage}%`);
    
    if (current === total) {
      console.log(); // New line when complete
    }
  }

  /**
   * Display a banner message
   */
  banner(message: string, color: 'blue' | 'green' | 'yellow' | 'red' | 'magenta' = 'blue') {
    if (this.options.silent) return;
    
    const colors = {
      blue: chalk.blue,
      green: chalk.green,
      yellow: chalk.yellow,
      red: chalk.red,
      magenta: chalk.magenta
    };
    
    const colorFn = colors[color];
    const border = '═'.repeat(message.length + 4);
    
    console.log(colorFn(`\n╔${border}╗`));
    console.log(colorFn(`║  ${message}  ║`));
    console.log(colorFn(`╚${border}╝\n`));
  }

  /**
   * Display an ASCII box with content
   */
  box(content: string[], title?: string) {
    if (this.options.silent) return;
    
    const maxLength = Math.max(...content.map(line => line.length));
    const width = Math.max(maxLength, title ? title.length : 0) + 4;
    const horizontalBorder = '─'.repeat(width - 2);
    
    console.log(`┌${horizontalBorder}┐`);
    
    if (title) {
      const paddedTitle = title.padStart((width + title.length) / 2).padEnd(width - 2);
      console.log(`│${chalk.bold.cyan(paddedTitle)}│`);
      console.log(`├${horizontalBorder}┤`);
    }
    
    content.forEach(line => {
      const paddedLine = line.padEnd(width - 4);
      console.log(`│  ${paddedLine}  │`);
    });
    
    console.log(`└${horizontalBorder}┘`);
  }

  /**
   * Clear the console
   */
  clear() {
    if (this.options.silent) return;
    console.clear();
  }

  /**
   * Create a nested logger with indentation
   */
  createNested(indent = 2): Logger {
    const nestedLogger = new Logger(this.options);
    const originalMethods = ['info', 'success', 'warn', 'error', 'debug'];
    
    originalMethods.forEach(method => {
      const original = nestedLogger[method as keyof Logger] as Function;
      (nestedLogger as any)[method] = (message: string, ...args: any[]) => {
        const indentStr = ' '.repeat(indent);
        return original.call(nestedLogger, `${indentStr}${message}`, ...args);
      };
    });
    
    return nestedLogger;
  }
}

// Create default logger instance
export const logger = new Logger({ verbose: process.env.VERBOSE === 'true' });

// Utility functions
export const withSpinner = async <T>(
  message: string,
  task: () => Promise<T>,
  successMessage?: string
): Promise<T> => {
  const spinner = logger.startSpinner(message);
  
  try {
    const result = await task();
    logger.stopSpinner(successMessage);
    return result;
  } catch (error) {
    logger.failSpinner();
    throw error;
  }
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

export const createProgressReporter = (total: number) => {
  let current = 0;
  
  return {
    increment: (message?: string) => {
      current++;
      logger.progress(current, total, message);
    },
    
    complete: (message?: string) => {
      current = total;
      logger.progress(current, total, message);
    },
    
    reset: () => {
      current = 0;
    }
  };
};