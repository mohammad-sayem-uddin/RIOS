/**
 * Base domain error — thrown when a domain invariant is violated.
 */

export class DomainError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode = 400) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}
