/**
 * Identity Domain Errors
 *
 * Business-level error exceptions for the Identity Bounded Context.
 * Architecture Reference: Volume I – Identity / Chapter 4 §40
 */

import { DomainError } from '@rios/shared';

export class IdentityDomainError extends DomainError {
  constructor(message: string, code = 'IDENTITY_DOMAIN_ERROR') {
    super(message, code);
  }
}

export class InvalidCredentialsError extends IdentityDomainError {
  constructor(message = 'Invalid email or password') {
    super(message, 'AUTH_INVALID_CREDENTIALS');
  }
}

export class AccountDisabledError extends IdentityDomainError {
  constructor(message = 'Account is disabled or inactive') {
    super(message, 'AUTH_ACCOUNT_DISABLED');
  }
}

export class AccountLockedError extends IdentityDomainError {
  constructor(message = 'Account has been temporarily locked due to excessive failed attempts') {
    super(message, 'AUTH_ACCOUNT_LOCKED');
  }
}

export class RoleNotFoundError extends IdentityDomainError {
  constructor(roleIdOrName: string) {
    super(`Role not found: ${roleIdOrName}`, 'ROLE_NOT_FOUND');
  }
}

export class PermissionDeniedError extends IdentityDomainError {
  constructor(permissionName: string) {
    super(`Permission denied: ${permissionName}`, 'PERMISSION_DENIED');
  }
}

export class SessionExpiredError extends IdentityDomainError {
  constructor(message = 'Session has expired') {
    super(message, 'SESSION_EXPIRED');
  }
}

export class SessionRevokedError extends IdentityDomainError {
  constructor(message = 'Session has been revoked') {
    super(message, 'SESSION_REVOKED');
  }
}

export class DuplicateEmailError extends IdentityDomainError {
  constructor(email: string) {
    super(`A user with email '${email}' already exists`, 'DUPLICATE_EMAIL');
  }
}

export class WeakPasswordError extends IdentityDomainError {
  constructor(reason: string) {
    super(`Password does not meet complexity requirements: ${reason}`, 'WEAK_PASSWORD');
  }
}
