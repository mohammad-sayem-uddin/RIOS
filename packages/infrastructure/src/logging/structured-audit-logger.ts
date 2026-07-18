/**
 * Structured Audit Logger
 *
 * Security audit event logger for recording security actions without exposing sensitive payloads.
 * Architecture Reference: Volume I – Identity / Chapter 6 §66
 */

import type { Logger } from './logger.js';

export interface AuditEventData {
  action: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  status: 'SUCCESS' | 'FAILURE' | 'DENIED';
  reason?: string;
  details?: Record<string, unknown>;
}

export interface IAuditLogger {
  logAuditEvent(data: AuditEventData): void;
}

export class StructuredAuditLogger implements IAuditLogger {
  constructor(private readonly logger?: Logger) {}

  public logAuditEvent(data: AuditEventData): void {
    const userId =
      data.userId !== undefined && data.userId.trim() !== '' ? data.userId : 'ANONYMOUS';
    const sessionId =
      data.sessionId !== undefined && data.sessionId.trim() !== '' ? data.sessionId : 'N/A';
    const ipAddress =
      data.ipAddress !== undefined && data.ipAddress.trim() !== '' ? data.ipAddress : 'UNKNOWN';

    const auditRecord = {
      timestamp: new Date().toISOString(),
      category: 'SECURITY_AUDIT',
      action: data.action,
      userId,
      sessionId,
      ipAddress,
      status: data.status,
      reason: data.reason,
      details: data.details,
    };

    if (this.logger !== undefined) {
      this.logger.info(`[AUDIT] ${data.action} - ${data.status}`, auditRecord);
    } else {
      process.stdout.write(`[AUDIT] ${JSON.stringify(auditRecord)}\n`);
    }
  }
}
