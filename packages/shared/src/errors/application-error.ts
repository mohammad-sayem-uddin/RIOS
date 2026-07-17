/**
 * Application error — thrown when an application-level operation fails.
 */

export class ApplicationError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode = 500) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}
