/**
 * Security Context
 *
 * Immutable per-request identity & security context attached to authenticated HTTP requests.
 * Architecture Reference: Volume I – Identity / Chapter 7 §82, Chapter 11 §153
 */

export interface SecurityContext {
  readonly userId: string;
  readonly email: string;
  readonly sessionId: string;
  readonly roles: readonly string[];
  readonly permissions: readonly string[];
  readonly isAuthenticated: boolean;
  readonly correlationId: string;
  readonly requestId: string;
  readonly authenticatedAt: Date;
}

export function createSecurityContext(params: {
  userId: string;
  email: string;
  sessionId: string;
  roles: string[];
  permissions: string[];
  correlationId?: string;
  requestId?: string;
}): SecurityContext {
  return Object.freeze({
    userId: params.userId,
    email: params.email,
    sessionId: params.sessionId,
    roles: Object.freeze([...params.roles]),
    permissions: Object.freeze([...params.permissions]),
    isAuthenticated: true,
    correlationId:
      params.correlationId !== undefined && params.correlationId.trim() !== ''
        ? params.correlationId
        : 'N/A',
    requestId:
      params.requestId !== undefined && params.requestId.trim() !== '' ? params.requestId : 'N/A',
    authenticatedAt: new Date(),
  });
}
