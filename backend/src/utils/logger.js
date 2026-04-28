/**
 * Logger utility for structured logging
 * Handles console and file logging with different levels
 */

const fs = require('fs');
const path = require('path');

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const COLORS = {
  error: '\x1b[31m',   // Red
  warn: '\x1b[33m',    // Yellow
  info: '\x1b[36m',    // Cyan
  debug: '\x1b[35m',   // Magenta
  reset: '\x1b[0m'     // Reset
};

class Logger {
  constructor() {
    this.level = process.env.LOG_LEVEL || 'info';
    this.logDir = process.env.LOG_FILE ? path.dirname(process.env.LOG_FILE) : './logs';
    this.logFile = process.env.LOG_FILE || path.join(this.logDir, 'app.log');
    
    // Create log directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  log(level, message, data = {}) {
    if (LOG_LEVELS[level] > LOG_LEVELS[this.level]) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    const fullMessage = JSON.stringify({ timestamp, level, message, ...data });

    // Console output with colors
    const coloredMessage = `${COLORS[level]}${logMessage}${COLORS.reset}`;
    console.log(coloredMessage);

    // File output
    try {
      fs.appendFileSync(this.logFile, fullMessage + '\n');
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }

  error(message, data) {
    this.log('error', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  info(message, data) {
    this.log('info', message, data);
  }

  debug(message, data) {
    this.log('debug', message, data);
  }
}

module.exports = new Logger();
