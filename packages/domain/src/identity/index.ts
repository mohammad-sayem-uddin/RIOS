/**
 * Identity Bounded Context - Domain Layer Re-exports
 */

// Aggregates
export { User, UserStatus, type UserStatusType, type UserProps } from './aggregates/user.js';

// Entities
export { Permission, type PermissionProps } from './entities/permission.js';
export { Role, type RoleProps } from './entities/role.js';
export { Session, type SessionProps } from './entities/session.js';
export { Credential, type CredentialProps } from './entities/credential.js';
export {
  RefreshTokenRecord,
  type RefreshTokenRecordProps,
} from './entities/refresh-token-record.js';
export { VerificationToken, type VerificationTokenProps } from './entities/verification-token.js';
export {
  AuditLogEntry,
  AuditOutcome,
  type AuditLogEntryProps,
  type AuditOutcomeType,
} from './entities/audit-log-entry.js';

// Value Objects
export {
  UserId,
  RoleId,
  PermissionId,
  SessionId,
  Email,
  PasswordHash,
  RefreshToken,
  AccessToken,
} from './value-objects/identity-value-objects.js';

// Errors
export {
  IdentityDomainError,
  InvalidCredentialsError,
  AccountDisabledError,
  AccountLockedError,
  RoleNotFoundError,
  PermissionDeniedError,
  SessionExpiredError,
  SessionRevokedError,
  DuplicateEmailError,
  WeakPasswordError,
} from './errors/identity-errors.js';

// Events
export {
  UserRegistered,
  UserActivated,
  UserDeactivated,
  PasswordChanged,
  EmailVerified,
  PasswordResetRequested,
  UserLoggedIn,
  UserLoggedOut,
  SessionCreated,
  SessionRevoked,
  RoleAssigned,
  RoleRemoved,
} from './events/identity-events.js';

// Repository Contracts
export type {
  IUserRepository,
  ISessionRepository,
  IRoleRepository,
  IPermissionRepository,
  IRefreshTokenRepository,
  IAuditLogRepository,
  IEmailVerificationTokenRepository,
  IPasswordResetTokenRepository,
} from './repositories/repository-contracts.js';

// Domain Service Contracts
export type {
  IPasswordHasher,
  ITokenProvider,
  IAuthorizationService,
  IAuthenticationService,
  PasswordHashResult,
  TokenClaims,
  IssuedTokens,
  AuthenticationResult,
  GeneratedToken,
  IVerificationTokenGenerator,
  IAccountEmailNotifier,
  AccountEmailKind,
} from './services/domain-service-contracts.js';
