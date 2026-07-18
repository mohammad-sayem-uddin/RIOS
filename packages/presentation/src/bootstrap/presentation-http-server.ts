/**
 * Presentation HTTP Server.
 *
 * Manages HTTP server startup, listening socket, connections, and graceful shutdown lifecycle.
 */

import http from 'node:http';

import type { Logger } from '@rios/infrastructure';
import type { Express } from 'express';

export class PresentationHttpServer {
  private server: http.Server | null = null;
  private listening = false;

  constructor(
    public readonly app: Express,
    public readonly port: number,
    public readonly host: string,
    private readonly logger?: Logger,
  ) {}

  public get isListening(): boolean {
    return this.listening;
  }

  public async start(): Promise<void> {
    if (this.listening && this.server) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.server = http.createServer(this.app);

      this.server.on('error', (err: Error) => {
        if (this.logger) {
          this.logger.error(
            `HTTP Server encountered error on ${this.host}:${this.port}: ${err.message}`,
          );
        }
        reject(err);
      });

      this.server.listen(this.port, this.host, () => {
        this.listening = true;
        if (this.logger) {
          this.logger.info(`HTTP Server started and listening on http://${this.host}:${this.port}`);
        }
        resolve();
      });
    });
  }

  public async stop(): Promise<void> {
    if (!this.server || !this.listening) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.server?.close((err?: Error) => {
        this.listening = false;
        this.server = null;
        if (err) {
          if (this.logger) {
            this.logger.error(`Error stopping HTTP Server: ${err.message}`);
          }
          reject(err);
          return;
        }
        if (this.logger) {
          this.logger.info('HTTP Server stopped gracefully.');
        }
        resolve();
      });
    });
  }
}
