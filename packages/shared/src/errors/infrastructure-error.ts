/**
 * Infrastructure error — thrown when an infrastructure-level operation fails.
 * Database, event store, external service, network failures.
 */

export class InfrastructureError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode = 503) {
    super(message);
    this.name = 'InfrastructureError';
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, InfrastructureError.prototype);
  }
}
