// @ts-nocheck
const http = require('http');
const { Logger } = require('./logger');

/**
 * Custom HTTP server with comprehensive logging
 */
class KillpServer {
  /**
   * @param {Object} [options={}]
   * @param {number} [options.port=3000]
   * @param {'error'|'warn'|'info'|'verbose'|'debug'|'silly'} [options.logLevel='info']
   */
  constructor(options = {}) {
    this.port = options.port || 3000;
    this.logger = new Logger(options.logLevel || 'info');
    this.server = http.createServer(this.requestHandler.bind(this));
  }

  /**
   * Handle incoming HTTP requests
   * @param {import('http').IncomingMessage} req
   * @param {import('http').ServerResponse} res
   */
  requestHandler(req, res) {
    const startTime = process.hrtime();
    
    // Log request details
    this.logger.logRequest(req);
    
    // Capture response data
    const originalWrite = res.write;
    const originalEnd = res.end;
    /**
       * @type {any[] | readonly Uint8Array<ArrayBufferLike>[]}
       */
    const chunks = [];
    
    res.write = function(chunk, ...args) {
      chunks.push(chunk);
      return originalWrite.apply(res, [chunk, ...args]);
    };
    
    res.end = (chunk, ...args) => {
      if (chunk) chunks.push(chunk);
      
      const responseTime = process.hrtime(startTime);
      const responseTimeMs = (responseTime[0] * 1e3 + responseTime[1] * 1e-6).toFixed(3);
      
      const responseBody = Buffer.concat(chunks).toString('utf8');
      
      this.logger.logResponse({
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        body: responseBody,
        responseTime: responseTimeMs
      });
      
      return originalEnd.apply(res, [chunk, ...args]);
    };
    
    // Default response if no route handlers
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Node::Killp Server is running\n');
  }

  /**
   * Start the server
   * @param {Function} [callback]
   * @returns {KillpServer}
   */
  start(callback) {
    this.server.listen(this.port, () => {
      this.logger.info(`Server started on port ${this.port}`);
      if (callback) callback();
    });
    
    return this;
  }

  /**
   * Stop the server
   * @param {Function} [callback]
   * @returns {KillpServer}
   */
  stop(callback) {
    this.server.close(() => {
      this.logger.info(`Server stopped`);
      if (callback) callback();
    });
    
    return this;
  }
}

module.exports = { KillpServer };