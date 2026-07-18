/**
 * Presentation Configuration Loader.
 *
 * Safely loads, validates, and defaults HTTP server configuration options
 * from environment variables or custom overrides without duplicating Infrastructure settings.
 */

import { DEFAULT_PRESENTATION_CONFIG, type PresentationConfig } from './presentation-config.js';

export class PresentationConfigurationLoader {
  /**
   * Loads PresentationConfig from environment variables or explicitly passed overrides.
   * Performs validation to guarantee port and host parameters are valid.
   *
   * @param overrides - Optional partial configuration overrides.
   * @returns Validated immutable PresentationConfig instance.
   */
  public static load(overrides: Partial<PresentationConfig> = {}): PresentationConfig {
    const rawPort = overrides.port ?? process.env['PORT'] ?? process.env['HTTP_PORT'];
    const port = rawPort !== undefined ? Number(rawPort) : DEFAULT_PRESENTATION_CONFIG.port;

    if (Number.isNaN(port) || port <= 0 || port > 65535) {
      throw new Error(
        `Invalid HTTP port configuration: ${String(rawPort)}. Port must be a number between 1 and 65535.`,
      );
    }

    const host = overrides.host ?? process.env['HOST'] ?? DEFAULT_PRESENTATION_CONFIG.host;
    const rawTimeout = process.env['HTTP_TIMEOUT_MS'];
    const requestTimeoutMs =
      overrides.requestTimeoutMs ??
      (typeof rawTimeout === 'string' && rawTimeout.trim().length > 0
        ? Number(rawTimeout)
        : DEFAULT_PRESENTATION_CONFIG.requestTimeoutMs);
    const bodySizeLimit =
      overrides.bodySizeLimit ??
      process.env['HTTP_BODY_LIMIT'] ??
      DEFAULT_PRESENTATION_CONFIG.bodySizeLimit;

    const compressionEnabled =
      overrides.compressionEnabled ??
      (process.env['HTTP_COMPRESSION_ENABLED'] !== undefined
        ? process.env['HTTP_COMPRESSION_ENABLED'] === 'true'
        : DEFAULT_PRESENTATION_CONFIG.compressionEnabled);

    const swaggerEnabled =
      overrides.swaggerEnabled ??
      (process.env['SWAGGER_ENABLED'] !== undefined
        ? process.env['SWAGGER_ENABLED'] === 'true'
        : DEFAULT_PRESENTATION_CONFIG.swaggerEnabled);

    const versionPrefix =
      overrides.versionPrefix ??
      process.env['API_VERSION_PREFIX'] ??
      DEFAULT_PRESENTATION_CONFIG.versionPrefix;
    const environment =
      overrides.environment ?? process.env['NODE_ENV'] ?? DEFAULT_PRESENTATION_CONFIG.environment;

    const rawCors = process.env['CORS_ALLOWED_ORIGINS'];
    const corsAllowedOrigins =
      overrides.corsAllowedOrigins ??
      (typeof rawCors === 'string' && rawCors.trim().length > 0
        ? rawCors.split(',').map((s) => s.trim())
        : DEFAULT_PRESENTATION_CONFIG.corsAllowedOrigins);

    return Object.freeze({
      port,
      host,
      requestTimeoutMs,
      bodySizeLimit,
      compressionEnabled,
      swaggerEnabled,
      versionPrefix,
      environment,
      corsAllowedOrigins,
    });
  }
}
