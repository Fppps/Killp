// @ts-nocheck
const winston = require('winston');
const chalk = require('chalk');

/**
 * @typedef {Object} ResponseLogData
 * @property {number} statusCode
 * @property {Object.<string, string|string[]>} headers
 * @property {string} body
 * @property {string} responseTime
 */

/**
 * Logger class for handling server logs with different levels
 */
class Logger {
  /**
   * @param {'error'|'warn'|'info'|'verbose'|'debug'|'silly'} [level='info'] 
   */
  constructor(level = 'info') {
    this.logger = winston.createLogger({
      level: level,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
          return `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}`;
        })
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'killp-server.log' })
      ]
    });
  }

  /**
   * Log informational message
   * @param {string} message 
   */
  info(message) {
    this.logger.info(chalk.blue(message));
  }

  /**
   * Log error message
   * @param {string} message 
   */
  error(message) {
    this.logger.error(chalk.red(message));
  }

  /**
   * Log HTTP request details
   * @param {import('http').IncomingMessage} req 
   */
  logRequest(req) {
    const { method, url, headers, socket } = req;
    this.logger.info(chalk.yellow(`[REQUEST] ${method} ${url}`));
    this.logger.debug(`Headers: ${JSON.stringify(headers)}`);
    this.logger.debug(`Remote Address: ${socket.remoteAddress}`);
  }

  /**
   * Log HTTP response details
   * @param {ResponseLogData} responseData
   */
  logResponse({ statusCode, headers, body, responseTime }) {
    const statusColor = statusCode >= 400 ? chalk.red : statusCode >= 300 ? chalk.yellow : chalk.green;
    this.logger.info(statusColor(`[RESPONSE] Status: ${statusCode} | Time: ${responseTime}ms`));
    this.logger.debug(`Response Headers: ${JSON.stringify(headers)}`);
    this.logger.silly(`Response Body: ${body}`);
  }
}

module.exports = { Logger };