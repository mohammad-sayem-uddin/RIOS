/**
 * Result HTTP Mapper & Responder.
 *
 * Translates Application Service Result<T> outcomes into standardized HTTP responses.
 * Centralizes HTTP status code mapping and envelope formatting.
 */

import type { Result } from '@rios/shared';
import type { Response } from 'express';

import { ApiResponseFactory } from '../dto/api-response.dto.js';

export class ResultHttpMapper {
  /**
   * Maps an Application Result<T> to an Express HTTP Response.
   *
   * @param res - Express Response object.
   * @param result - Result<T> returned by Application Service.
   * @param successStatusCode - HTTP status code on success (default 200 OK).
   * @param correlationId - Optional correlation ID for error responses.
   * @param dataTransform - Optional transformation function applied to result.value before returning.
   */
  public static mapResult<T, R = T>(
    res: Response,
    result: Result<T>,
    successStatusCode = 200,
    correlationId?: string,
    dataTransform?: (val: T) => R,
  ): void {
    if (result.isSuccess) {
      const payload =
        dataTransform && result.value !== undefined
          ? dataTransform(result.value)
          : (result.value as unknown as R);
      res.status(successStatusCode).json(ApiResponseFactory.success(payload, { correlationId }));
      return;
    }

    const errorMessage = result.error;
    const statusCode = this.determineStatusCode(errorMessage);
    const errorCode = this.determineErrorCode(statusCode, errorMessage);

    res.status(statusCode).json(
      ApiResponseFactory.failure({
        code: errorCode,
        message: errorMessage,
        correlationId,
      }),
    );
  }

  private static determineStatusCode(error: string): number {
    const lower = error.toLowerCase();
    if (lower.includes('not found') || lower.includes('notfound')) {
      return 404;
    }
    if (
      lower.includes('conflict') ||
      lower.includes('concurrency') ||
      lower.includes('already exists')
    ) {
      return 409;
    }
    if (
      lower.includes('invalid') ||
      lower.includes('validation') ||
      lower.includes('invariant') ||
      lower.includes('required')
    ) {
      return 400;
    }
    return 400; // Default application domain failure to 400 Bad Request
  }

  private static determineErrorCode(statusCode: number, _error: string): string {
    if (statusCode === 404) return 'RESOURCE_NOT_FOUND';
    if (statusCode === 409) return 'CONCURRENCY_CONFLICT';
    if (statusCode === 400) return 'BAD_REQUEST';
    return 'APPLICATION_ERROR';
  }
}
