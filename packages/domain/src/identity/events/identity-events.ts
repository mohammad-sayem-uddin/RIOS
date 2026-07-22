/**
 * Identity Domain Events
 *
 * Domain events emitted by the Identity aggregate root and authentication processes.
 * Architecture Reference: Volume I – Identity / Chapter 4 §38
 */

import { DomainEvent, EventMetadata } from '@rios/shared';

export class UserRegistered extends DomainEvent {
  public readonly eventType = 'UserRegistered';

  constructor(
    public readonly userId: string,
    public readonly email: string,
    metadata?: Partial<EventMetadata>,
  ) {
    super(userId, metadata);
  }
}

export class UserActivated extends DomainEvent {
  public readonly eventType = 'UserActivated';

  constructor(
    public readonly userId: string,
    metadata?: Partial<EventMetadata>,
  ) {
    super(userId, metadata);
  }
}

export class UserDeactivated extends DomainEvent {
  public readonly eventType = 'UserDeactivated';

  constructor(
    public readonly userId: string,
    public readonly reason: string,
    metadata?: Partial<EventMetadata>,
  ) {
    super(userId, metadata);
  }
}

export class PasswordChanged extends DomainEvent {
  public readonly eventType = 'PasswordChanged';

  constructor(
    public readonly userId: string,
    metadata?: Partial<EventMetadata>,
  ) {
    super(userId, metadata);
  }
}

export class EmailVerified extends DomainEvent {
  public readonly eventType = 'EmailVerified';

  constructor(
    public readonly userId: string,
    public readonly email: string,
    metadata?: Partial<EventMetadata>,
  ) {
    super(userId, metadata);
  }
}

export class PasswordResetRequested extends DomainEvent {
  public readonly eventType = 'PasswordResetRequested';

  constructor(
    public readonly userId: string,
    public readonly email: string,
    metadata?: Partial<EventMetadata>,
  ) {
    super(userId, metadata);
  }
}

export class UserLoggedIn extends DomainEvent {
  public readonly eventType = 'UserLoggedIn';

  constructor(
    public readonly userId: string,
    public readonly sessionId: string,
    public readonly ipAddress?: string,
    metadata?: Partial<EventMetadata>,
  ) {
    super(userId, metadata);
  }
}

export class UserLoggedOut extends DomainEvent {
  public readonly eventType = 'UserLoggedOut';

  constructor(
    public readonly userId: string,
    public readonly sessionId: string,
    metadata?: Partial<EventMetadata>,
  ) {
    super(userId, metadata);
  }
}

export class SessionCreated extends DomainEvent {
  public readonly eventType = 'SessionCreated';

  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly expiresAt: Date,
    metadata?: Partial<EventMetadata>,
  ) {
    super(sessionId, metadata);
  }
}

export class SessionRevoked extends DomainEvent {
  public readonly eventType = 'SessionRevoked';

  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly reason: string,
    metadata?: Partial<EventMetadata>,
  ) {
    super(sessionId, metadata);
  }
}

export class RoleAssigned extends DomainEvent {
  public readonly eventType = 'RoleAssigned';

  constructor(
    public readonly userId: string,
    public readonly roleName: string,
    metadata?: Partial<EventMetadata>,
  ) {
    super(userId, metadata);
  }
}

export class RoleRemoved extends DomainEvent {
  public readonly eventType = 'RoleRemoved';

  constructor(
    public readonly userId: string,
    public readonly roleName: string,
    metadata?: Partial<EventMetadata>,
  ) {
    super(userId, metadata);
  }
}
