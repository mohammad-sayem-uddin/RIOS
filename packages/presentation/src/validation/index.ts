/**
 * Validation Module — Presentation Layer
 */

export type { ValidationErrorDetail, ValidationResult } from './validation-result.js';
export { ValidationException } from './validation-result.js';
export { SchemaValidator, type SchemaRules, type FieldRule } from './schema-validator.js';
export { createValidationMiddleware, type RequestTarget } from './validation.middleware.js';
