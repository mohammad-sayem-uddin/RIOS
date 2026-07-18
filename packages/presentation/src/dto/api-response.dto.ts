/**
 * Standardized API Response DTO envelopes.
 *
 * Guarantees every HTTP endpoint returns a uniform payload envelope structure.
 */

export interface ApiErrorDto {
  /**
   * Application or domain error code.
   */
  readonly code: string;

  /**
   * Human-readable error message.
   */
  readonly message: string;

  /**
   * Optional list of specific field validation error details.
   */
  readonly details?: string[];

  /**
   * Request correlation ID for tracing.
   */
  readonly correlationId?: string;

  /**
   * ISO-8601 timestamp of error occurrence.
   */
  readonly timestamp: string;
}

export interface ApiMetaDto {
  readonly page?: number;
  readonly limit?: number;
  readonly total?: number;
  readonly correlationId?: string;
  readonly timestamp: string;
}

export interface ApiResponseDto<T = unknown> {
  /**
   * Success indicator.
   */
  readonly success: boolean;

  /**
   * Data payload when operation succeeds.
   */
  readonly data?: T;

  /**
   * Error details when operation fails.
   */
  readonly error?: ApiErrorDto;

  /**
   * Optional metadata (pagination, tracing, timestamps).
   */
  readonly meta?: ApiMetaDto;
}

export class ApiResponseFactory {
  public static success<T>(data: T, meta?: Partial<ApiMetaDto>): ApiResponseDto<T> {
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }

  public static failure(error: {
    code: string;
    message: string;
    details?: string[];
    correlationId?: string;
  }): ApiResponseDto<never> {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        correlationId: error.correlationId,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
