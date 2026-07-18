/**
 * Health Response DTO.
 *
 * Defines format for health, liveness, and readiness probe responses.
 */

export interface ComponentHealthDto {
  readonly status: 'UP' | 'DOWN' | 'DEGRADED';
  readonly details?: Record<string, unknown>;
}

export interface HealthResponseDto {
  readonly status: 'UP' | 'DOWN' | 'DEGRADED';
  readonly timestamp: string;
  readonly environment: string;
  readonly components?: Record<string, ComponentHealthDto>;
}
