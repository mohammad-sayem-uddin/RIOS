/**
 * Audit Log Entry Entity
 *
 * Domain entity representing immutable, persisted security audit evidence.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { UserId } from '../value-objects/identity-value-objects.js';

export const AuditOutcome = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
} as const;

export type AuditOutcomeType = (typeof AuditOutcome)[keyof typeof AuditOutcome];

export interface AuditLogEntryProps {
  userId: UserId | null;
  action: string;
  outcome: AuditOutcomeType;
  occurredAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  correlationId: string | null;
  details: Readonly<Record<string, string | number | boolean | null>>;
}

export class AuditLogEntry extends Entity<AuditLogEntryProps> {
  private constructor(props: AuditLogEntryProps, id: UniqueId) {
    super(props, id);
  }

  public get auditLogId(): string {
    return this._id.value;
  }

  public get userId(): UserId | null {
    return this.props.userId;
  }

  public get action(): string {
    return this.props.action;
  }

  public get outcome(): AuditOutcomeType {
    return this.props.outcome;
  }

  public get occurredAt(): Date {
    return this.props.occurredAt;
  }

  public get ipAddress(): string | null {
    return this.props.ipAddress;
  }

  public get userAgent(): string | null {
    return this.props.userAgent;
  }

  public get correlationId(): string | null {
    return this.props.correlationId;
  }

  public get details(): Readonly<Record<string, string | number | boolean | null>> {
    return this.props.details;
  }

  public static create(
    props: {
      userId?: UserId | null;
      action: string;
      outcome: AuditOutcomeType;
      occurredAt?: Date;
      ipAddress?: string | null;
      userAgent?: string | null;
      correlationId?: string | null;
      details?: Record<string, string | number | boolean | null>;
    },
    id?: string,
  ): Result<AuditLogEntry> {
    if (!props.action || props.action.trim().length === 0) {
      return Result.fail('Audit action is required');
    }

    if (!Object.values(AuditOutcome).includes(props.outcome)) {
      return Result.fail('Audit outcome is invalid');
    }

    const entry = new AuditLogEntry(
      {
        userId: props.userId ?? null,
        action: props.action.trim(),
        outcome: props.outcome,
        occurredAt: props.occurredAt ?? new Date(),
        ipAddress: props.ipAddress ?? null,
        userAgent: props.userAgent ?? null,
        correlationId: props.correlationId ?? null,
        details: Object.freeze({ ...(props.details ?? {}) }),
      },
      id !== undefined && id !== '' ? UniqueId.from(id) : UniqueId.create(),
    );

    return Result.ok(entry);
  }
}
