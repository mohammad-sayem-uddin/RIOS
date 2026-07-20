/**
 * Enterprise Platform Infrastructure Providers
 */

export interface INotificationProvider {
  send(recipientId: string, channel: string, message: string, subject?: string): Promise<boolean>;
}

export class InMemoryNotificationProvider implements INotificationProvider {
  public sentNotifications: Array<{
    recipientId: string;
    channel: string;
    message: string;
    subject?: string;
  }> = [];

  public send(
    recipientId: string,
    channel: string,
    message: string,
    subject?: string,
  ): Promise<boolean> {
    this.sentNotifications.push({ recipientId, channel, message, subject });
    return Promise.resolve(true);
  }
}

export interface IEmailProvider {
  sendEmail(to: string, subject: string, body: string, isHtml?: boolean): Promise<boolean>;
}

export class MockEmailProvider implements IEmailProvider {
  public sentEmails: Array<{ to: string; subject: string; body: string; isHtml?: boolean }> = [];

  public sendEmail(to: string, subject: string, body: string, isHtml?: boolean): Promise<boolean> {
    this.sentEmails.push({ to, subject, body, isHtml });
    return Promise.resolve(true);
  }
}

export interface IWebhookProvider {
  dispatch(url: string, payload: Record<string, unknown>, secret?: string): Promise<boolean>;
}

export class HttpWebhookProvider implements IWebhookProvider {
  public dispatchedWebhooks: Array<{
    url: string;
    payload: Record<string, unknown>;
    secret?: string;
  }> = [];

  public dispatch(
    url: string,
    payload: Record<string, unknown>,
    secret?: string,
  ): Promise<boolean> {
    this.dispatchedWebhooks.push({ url, payload, secret });
    return Promise.resolve(true);
  }
}

export interface ICacheProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export class InMemoryCacheProvider implements ICacheProvider {
  private cache: Map<string, { value: unknown; expiresAt?: number }> = new Map();

  public get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return Promise.resolve(null);
    if (typeof item.expiresAt === 'number' && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return Promise.resolve(null);
    }
    return Promise.resolve(item.value as T);
  }

  public set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiresAt = typeof ttlSeconds === 'number' ? Date.now() + ttlSeconds * 1000 : undefined;
    this.cache.set(key, { value, expiresAt });
    return Promise.resolve();
  }

  public delete(key: string): Promise<void> {
    this.cache.delete(key);
    return Promise.resolve();
  }
}

export interface IJobQueueProvider {
  enqueue(
    jobType: string,
    payload: Record<string, unknown>,
    options?: { delayMs?: number },
  ): Promise<string>;
}

export class InMemoryJobQueueProvider implements IJobQueueProvider {
  public queue: Array<{
    jobId: string;
    jobType: string;
    payload: Record<string, unknown>;
    delayMs?: number;
  }> = [];

  public enqueue(
    jobType: string,
    payload: Record<string, unknown>,
    options?: { delayMs?: number },
  ): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.queue.push({ jobId, jobType, payload, delayMs: options?.delayMs });
    return Promise.resolve(jobId);
  }
}

export interface IObjectStorageProvider {
  upload(key: string, buffer: Buffer, mimeType: string): Promise<string>;
  download(key: string): Promise<Buffer | null>;
  delete(key: string): Promise<void>;
}

export class LocalObjectStorageProvider implements IObjectStorageProvider {
  private storage: Map<string, { buffer: Buffer; mimeType: string }> = new Map();

  public upload(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    this.storage.set(key, { buffer, mimeType });
    return Promise.resolve(`local://storage/${key}`);
  }

  public download(key: string): Promise<Buffer | null> {
    const item = this.storage.get(key);
    return Promise.resolve(item ? item.buffer : null);
  }

  public delete(key: string): Promise<void> {
    this.storage.delete(key);
    return Promise.resolve();
  }
}

export interface IMetricsProvider {
  incrementCounter(name: string, value?: number, tags?: Record<string, string>): void;
  recordGauge(name: string, value: number, tags?: Record<string, string>): void;
}

export class InMemoryMetricsProvider implements IMetricsProvider {
  public counters: Map<string, number> = new Map();
  public gauges: Map<string, number> = new Map();

  public incrementCounter(name: string, value = 1, _tags?: Record<string, string>): void {
    const current = this.counters.get(name) ?? 0;
    this.counters.set(name, current + value);
  }

  public recordGauge(name: string, value: number, _tags?: Record<string, string>): void {
    this.gauges.set(name, value);
  }
}

export interface ITracingProvider {
  startSpan(name: string): { end: () => void };
}

export class InMemoryTracingProvider implements ITracingProvider {
  public spans: Array<{ name: string; durationMs?: number }> = [];

  public startSpan(name: string): { end: () => void } {
    const start = Date.now();
    return {
      end: (): void => {
        this.spans.push({ name, durationMs: Date.now() - start });
      },
    };
  }
}

export interface IConfigurationProvider {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

export class InMemoryConfigurationProvider implements IConfigurationProvider {
  private configs: Map<string, string> = new Map();

  public get(key: string): Promise<string | null> {
    return Promise.resolve(this.configs.get(key) ?? null);
  }

  public set(key: string, value: string): Promise<void> {
    this.configs.set(key, value);
    return Promise.resolve();
  }
}

export interface IHealthCheckProvider {
  checkHealth(): Promise<{
    status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
    details: Record<string, unknown>;
  }>;
}

export class SystemHealthCheckProvider implements IHealthCheckProvider {
  public checkHealth(): Promise<{
    status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
    details: Record<string, unknown>;
  }> {
    return Promise.resolve({
      status: 'HEALTHY',
      details: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
    });
  }
}
