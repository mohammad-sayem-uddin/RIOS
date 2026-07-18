/**
 * Prisma Error Translator
 *
 * Translates Prisma ORM specific error codes into Domain/Application Result failures
 * without leaking Prisma types into higher layers.
 *
 * Architecture reference:
 * Infrastructure Layer — Error Translation Standard (Sprint 6 Chapter 6 §89).
 */

import { Result } from '@rios/shared';

import { InfrastructureErrorMapper } from './infrastructure-error-mapper.js';

interface PrismaKnownError {
  code: string;
  message: string;
  meta?: Record<string, unknown>;
}

export class PrismaErrorTranslator {
  /**
   * Translates a caught error into a Result.fail<T>() with domain/infrastructure context.
   */
  static toResult<T>(error: unknown, context: string): Result<T> {
    if (PrismaErrorTranslator.isPrismaError(error)) {
      const prismaErr = error as PrismaKnownError;

      switch (prismaErr.code) {
        case 'P2002': // Unique constraint violation
          return Result.fail<T>(
            `[${context}] Unique constraint violation: duplicate record already exists`,
          );
        case 'P2025': // Record not found
          return Result.fail<T>(`[${context}] Record not found in database`);
        case 'P2003': // Foreign key constraint violation
          return Result.fail<T>(
            `[${context}] Foreign key constraint violation: referenced entity does not exist`,
          );
        case 'P2024': // Connection timeout
          return Result.fail<T>(`[${context}] Persistence connection timeout`);
        default:
          return Result.fail<T>(
            `[${context}] Database error (${prismaErr.code}): ${prismaErr.message}`,
          );
      }
    }

    return InfrastructureErrorMapper.toResult<T>(error, context);
  }

  private static isPrismaError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as Record<string, unknown>).code === 'string' &&
      ((error as Record<string, unknown>).code as string).startsWith('P')
    );
  }
}
