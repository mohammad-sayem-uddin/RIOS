/**
 * Enterprise Platform Bounded Context — Value Objects
 */

import { Result, UniqueId, ValueObject } from '@rios/shared';

export class NotificationId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): NotificationId {
    return new NotificationId(id ?? UniqueId.create().value);
  }

  public static from(id: string): NotificationId {
    return new NotificationId(id);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class AuditId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): AuditId {
    return new AuditId(id ?? UniqueId.create().value);
  }

  public static from(id: string): AuditId {
    return new AuditId(id);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class JobId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): JobId {
    return new JobId(id ?? UniqueId.create().value);
  }

  public static from(id: string): JobId {
    return new JobId(id);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class WebhookId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): WebhookId {
    return new WebhookId(id ?? UniqueId.create().value);
  }

  public static from(id: string): WebhookId {
    return new WebhookId(id);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class CorrelationId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): CorrelationId {
    return new CorrelationId(id ?? UniqueId.create().value);
  }

  public static from(id: string): CorrelationId {
    return new CorrelationId(id);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class TraceId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): TraceId {
    return new TraceId(id ?? UniqueId.create().value);
  }

  public static from(id: string): TraceId {
    return new TraceId(id);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class MetricId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): MetricId {
    return new MetricId(id ?? UniqueId.create().value);
  }

  public static from(id: string): MetricId {
    return new MetricId(id);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class StorageObjectKey extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(key: string): Result<StorageObjectKey> {
    const trimmed = key.trim();
    if (!trimmed) {
      return Result.fail<StorageObjectKey>('Storage object key cannot be empty');
    }
    return Result.ok<StorageObjectKey>(new StorageObjectKey(trimmed));
  }

  public static from(key: string): StorageObjectKey {
    return new StorageObjectKey(key.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class FeatureFlagName extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<FeatureFlagName> {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) {
      return Result.fail<FeatureFlagName>('Feature flag name cannot be empty');
    }
    if (!/^[a-z0-9_.-]+$/.test(trimmed)) {
      return Result.fail<FeatureFlagName>('Feature flag name contains invalid characters');
    }
    return Result.ok<FeatureFlagName>(new FeatureFlagName(trimmed));
  }

  public static from(name: string): FeatureFlagName {
    return new FeatureFlagName(name.trim().toLowerCase());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class ConfigurationKey extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(key: string): Result<ConfigurationKey> {
    const trimmed = key.trim().toUpperCase();
    if (!trimmed) {
      return Result.fail<ConfigurationKey>('Configuration key cannot be empty');
    }
    return Result.ok<ConfigurationKey>(new ConfigurationKey(trimmed));
  }

  public static from(key: string): ConfigurationKey {
    return new ConfigurationKey(key.trim().toUpperCase());
  }

  public override toString(): string {
    return this.props.value;
  }
}
