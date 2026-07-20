/**
 * Enterprise Platform Bounded Context — Repository Contracts
 */

import { AuditLog, BackgroundJob, Notification } from '../aggregates/index.js';
import { ConfigurationItem, FeatureFlag } from '../entities/index.js';
import {
  AuditId,
  ConfigurationKey,
  FeatureFlagName,
  JobId,
  NotificationId,
} from '../value-objects/index.js';

export interface INotificationRepository {
  save(notification: Notification): Promise<void>;
  findById(id: NotificationId): Promise<Notification | null>;
  findPending(): Promise<Notification[]>;
  search(query?: { recipientId?: string; status?: string }): Promise<Notification[]>;
  delete(id: NotificationId): Promise<void>;
}

export interface IAuditRepository {
  save(auditLog: AuditLog): Promise<void>;
  findById(id: AuditId): Promise<AuditLog | null>;
  search(query?: { userId?: string; action?: string; limit?: number }): Promise<AuditLog[]>;
}

export interface IJobRepository {
  save(job: BackgroundJob): Promise<void>;
  findById(id: JobId): Promise<BackgroundJob | null>;
  findPending(): Promise<BackgroundJob[]>;
  search(query?: { status?: string; jobType?: string }): Promise<BackgroundJob[]>;
  delete(id: JobId): Promise<void>;
}

export interface IConfigurationRepository {
  saveConfiguration(item: ConfigurationItem): Promise<void>;
  findConfigurationByKey(key: ConfigurationKey): Promise<ConfigurationItem | null>;
  findAllConfigurations(): Promise<ConfigurationItem[]>;
  deleteConfiguration(key: ConfigurationKey): Promise<void>;

  saveFeatureFlag(flag: FeatureFlag): Promise<void>;
  findFeatureFlagByName(name: FeatureFlagName): Promise<FeatureFlag | null>;
  findAllFeatureFlags(): Promise<FeatureFlag[]>;
}
