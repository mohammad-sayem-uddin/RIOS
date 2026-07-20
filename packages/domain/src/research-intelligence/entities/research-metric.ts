/**
 * ResearchMetric Entity (Sprint 11)
 *
 * Represents a single research metric data point for analytics.
 */

import { Entity, UniqueId, Result } from '@rios/shared';

import { MetricName } from '../value-objects/research-intelligence-value-objects.js';

export interface ResearchMetricProps {
  id: string;
  profileId: string;
  metricName: MetricName;
  value: number;
  unit: string;
  source: string;
  recordedAt: Date;
}

export class ResearchMetric extends Entity<ResearchMetricProps> {
  private constructor(props: ResearchMetricProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get metricName(): MetricName {
    return this.props.metricName;
  }

  public get value(): number {
    return this.props.value;
  }

  public get unit(): string {
    return this.props.unit;
  }

  public get source(): string {
    return this.props.source;
  }

  public get recordedAt(): Date {
    return this.props.recordedAt;
  }

  public static create(props: {
    id: string;
    profileId: string;
    metricName: string;
    value: number;
    unit: string;
    source: string;
    recordedAt: Date;
  }): Result<ResearchMetric> {
    if (props.profileId.trim().length === 0) {
      return Result.fail<ResearchMetric>('Profile ID is required');
    }

    const metricNameResult = MetricName.create(props.metricName);
    if (metricNameResult.isFailure) {
      return Result.fail<ResearchMetric>(metricNameResult.error);
    }

    if (props.unit.trim().length === 0) {
      return Result.fail<ResearchMetric>('Unit cannot be empty');
    }
    if (props.source.trim().length === 0) {
      return Result.fail<ResearchMetric>('Source cannot be empty');
    }

    return Result.ok<ResearchMetric>(
      new ResearchMetric({
        id: props.id,
        profileId: props.profileId.trim(),
        metricName: metricNameResult.value,
        value: props.value,
        unit: props.unit.trim(),
        source: props.source.trim(),
        recordedAt: props.recordedAt,
      }),
    );
  }
}
