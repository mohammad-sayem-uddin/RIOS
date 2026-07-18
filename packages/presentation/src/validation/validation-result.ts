/**
 * Validation Result Models & Exception.
 */

export interface ValidationErrorDetail {
  readonly field: string;
  readonly message: string;
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: ValidationErrorDetail[];
}

export class ValidationException extends Error {
  public readonly errors: ValidationErrorDetail[];

  constructor(
    errors: ValidationErrorDetail[],
    message = 'Validation failed for HTTP request payload.',
  ) {
    super(message);
    this.name = 'ValidationException';
    this.errors = errors;
  }
}
