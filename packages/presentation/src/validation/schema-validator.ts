/**
 * Schema Validator.
 *
 * Declarative structural schema validation for request payloads.
 * Zero business rules, zero database/repository calls.
 */

import type { ValidationErrorDetail, ValidationResult } from './validation-result.js';

export type FieldRule<T> = (value: unknown, obj: T) => ValidationErrorDetail | null;

export interface SchemaRules<T> {
  readonly [field: string]: FieldRule<T>[];
}

export class SchemaValidator<T extends Record<string, unknown>> {
  constructor(private readonly rules: SchemaRules<T>) {}

  public validate(data: unknown): ValidationResult {
    const errors: ValidationErrorDetail[] = [];

    if (data === null || data === undefined || typeof data !== 'object' || Array.isArray(data)) {
      return {
        isValid: false,
        errors: [{ field: '_body', message: 'Request payload must be a non-null JSON object.' }],
      };
    }

    const obj = data as T;

    for (const [field, fieldRules] of Object.entries(this.rules)) {
      const fieldValue = obj[field];
      for (const rule of fieldRules) {
        const error = rule(fieldValue, obj);
        if (error) {
          errors.push(error);
          break; // Stop at first rule failure per field
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // ——— Standard Declarative Field Rules ———

  public static required(field: string): FieldRule<Record<string, unknown>> {
    return (val) => {
      if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
        return { field, message: `Field '${field}' is required.` };
      }
      return null;
    };
  }

  public static string(field: string): FieldRule<Record<string, unknown>> {
    return (val) => {
      if (val !== undefined && val !== null && typeof val !== 'string') {
        return { field, message: `Field '${field}' must be a string.` };
      }
      return null;
    };
  }

  public static minLength(field: string, min: number): FieldRule<Record<string, unknown>> {
    return (val) => {
      if (typeof val === 'string' && val.length < min) {
        return { field, message: `Field '${field}' must be at least ${min} characters long.` };
      }
      return null;
    };
  }

  public static uuid(field: string): FieldRule<Record<string, unknown>> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return (val) => {
      if (typeof val === 'string' && !uuidRegex.test(val)) {
        return { field, message: `Field '${field}' must be a valid UUID.` };
      }
      return null;
    };
  }

  public static array(field: string): FieldRule<Record<string, unknown>> {
    return (val) => {
      if (val !== undefined && val !== null && !Array.isArray(val)) {
        return { field, message: `Field '${field}' must be an array.` };
      }
      return null;
    };
  }

  public static number(field: string): FieldRule<Record<string, unknown>> {
    return (val) => {
      if (val !== undefined && val !== null && (typeof val !== 'number' || Number.isNaN(val))) {
        return { field, message: `Field '${field}' must be a valid number.` };
      }
      return null;
    };
  }
}
