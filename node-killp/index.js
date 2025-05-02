/**
 * @typedef {Object} ServerOptions
 * @property {number} [port]
 * @property {'error'|'warn'|'info'|'verbose'|'debug'|'silly'} [logLevel]
 */

/**
 * Create a new KillpServer instance
 * @param {ServerOptions} [options]
 * @returns {KillpServer}
 */
const createServer = (options = {}) => {
    return new KillpServer(options);
  };
  
  module.exports = { createServer };