// Type definitions for node-killp

export interface ServerOptions {
    port?: number;
    logLevel?: 'error'|'warn'|'info'|'verbose'|'debug'|'silly';
  }
  
  export class KillpServer {
    constructor(options?: ServerOptions);
    start(callback?: () => void): KillpServer;
    stop(callback?: () => void): KillpServer;
  }
  
  export function createServer(options?: ServerOptions): KillpServer;