/**
 * Presentation Layer Configuration.
 *
 * Encapsulates all HTTP delivery mechanism configuration settings.
 * Strong typing, defaults, and isolation from infrastructure database concerns.
 */

export interface PresentationConfig {
  /**
   * Port on which the HTTP server will listen.
   * Default: 3000
   */
  readonly port: number;

  /**
   * Network host interface to bind to.
   * Default: '0.0.0.0'
   */
  readonly host: string;

  /**
   * Maximum request execution timeout in milliseconds.
   * Default: 30000ms (30s)
   */
  readonly requestTimeoutMs: number;

  /**
   * Maximum allowed JSON body size.
   * Default: '1mb'
   */
  readonly bodySizeLimit: string;

  /**
   * Whether HTTP response compression (gzip/deflate) is enabled.
   * Default: true
   */
  readonly compressionEnabled: boolean;

  /**
   * Whether OpenAPI / Swagger UI is exposed.
   * Default: true
   */
  readonly swaggerEnabled: boolean;

  /**
   * API Version prefix.
   * Default: '/api/v1'
   */
  readonly versionPrefix: string;

  /**
   * Active environment name (e.g. 'development', 'test', 'production').
   * Default: 'development'
   */
  readonly environment: string;

  /**
   * Allowed CORS origins.
   * Default: ['*']
   */
  readonly corsAllowedOrigins: string[];
}

export const DEFAULT_PRESENTATION_CONFIG: PresentationConfig = {
  port: 3000,
  host: '0.0.0.0',
  requestTimeoutMs: 30000,
  bodySizeLimit: '1mb',
  compressionEnabled: true,
  swaggerEnabled: true,
  versionPrefix: '/api/v1',
  environment: process.env['NODE_ENV'] ?? 'development',
  corsAllowedOrigins: ['*'],
};
