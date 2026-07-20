/**
 * Enterprise Platform Bounded Context — DTOs
 */

export interface NotificationDTO {
  id: string;
  recipientId: string;
  type: string;
  channel: string;
  subject?: string;
  message: string;
  status: string;
  retryCount: number;
  maxRetries: number;
  queuedAt: string;
  sentAt?: string;
  failedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogDTO {
  id: string;
  userId?: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface BackgroundJobDTO {
  id: string;
  jobType: string;
  payload: Record<string, unknown>;
  status: string;
  priority: number;
  retryCount: number;
  maxRetries: number;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  errorMessage?: string;
  executionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FeatureFlagDTO {
  id?: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  rules?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConfigurationItemDTO {
  id?: string;
  key: string;
  value: string;
  scope: string;
  isEncrypted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HealthStatusDTO {
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  version: string;
  uptimeSeconds: number;
  timestamp: string;
  components: Array<{
    name: string;
    status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
    message?: string;
    details?: Record<string, unknown>;
  }>;
}

export interface SystemMetricDTO {
  metricName: string;
  metricType: string;
  value: number;
  unit?: string;
  tags?: Record<string, string>;
  recordedAt: string;
}

export interface WebhookDTO {
  id: string;
  name: string;
  url: string;
  eventTypes: string[];
  isActive: boolean;
  lastTriggeredAt?: string;
  createdAt: string;
  updatedAt: string;
}
