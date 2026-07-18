/**
 * Request Context.
 *
 * Immutable per-request context containing metadata, correlation tracking,
 * client information, and execution timing.
 */

export interface RequestContext {
  /**
   * Unique request identifier for single HTTP execution tracing.
   */
  readonly requestId: string;

  /**
   * Correlation identifier for distributed request tracing.
   */
  readonly correlationId: string;

  /**
   * Request start timestamp in milliseconds since Unix epoch.
   */
  readonly startTimeMs: number;

  /**
   * Client IP address.
   */
  readonly clientIp: string;

  /**
   * Client User-Agent header value.
   */
  readonly userAgent: string;

  /**
   * HTTP method (e.g. GET, POST).
   */
  readonly method: string;

  /**
   * Requested path.
   */
  readonly path: string;

  /**
   * Resolved API version.
   */
  readonly apiVersion: string;
}

/**
 * Creates an immutable RequestContext instance.
 */
export function createRequestContext(params: {
  requestId: string;
  correlationId: string;
  clientIp: string;
  userAgent: string;
  method: string;
  path: string;
  apiVersion?: string;
}): RequestContext {
  return Object.freeze({
    requestId: params.requestId,
    correlationId: params.correlationId,
    startTimeMs: Date.now(),
    clientIp: params.clientIp,
    userAgent: params.userAgent,
    method: params.method,
    path: params.path,
    apiVersion: params.apiVersion ?? 'v1',
  });
}
