/**
 * ResearchMetric Entity (Sprint 11)
 *
 * Represents a single research metric data point for analytics.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import {
  MetricName,
  MetricType,
  MetricTypeValue,
  MetricValue,
} from '../value-objects/research-intelligence-value-objects.js';

export interface ResearchMetricProps {
  metricType: MetricType;
  metricName: string;
  value: MetricValue;
  measuredAt: Date;
}

export class ResearchMetric extends Entity<ResearchMetricProps> {
  private constructor(props: ResearchMetricProps, id?: UniqueId) {
    super(props, id);
  }

  public get metricType(): MetricType {
    return this.props.metricType;
  }

  public get metricName(): string {
    return this.props.metricName;
  }

  public get value(): MetricValue {
    return this.props.value;
  }

  public get measuredAt(): Date {
    return this.props.measuredAt;
  }

  public static create(
    props: {
      metricType: string;
      metricName: string;
      value: number;
      measuredAt?: Date;
    },
    id?: UniqueId,
  ): Result<ResearchMetric> {
    const typeRes = MetricType.create(props.metricType as MetricTypeValue);
    if (typeRes.isFailure) return Result.fail<ResearchMetric>(typeRes.error);

    const nameRes = MetricName.create(props.metricName);
    if (nameRes.isFailure) return Result.fail<ResearchMetric>(nameRes.error);

    const valRes = MetricValue.create(props.value);
    if (valRes.isFailure) return Result.fail<ResearchMetric>(valRes.error);

    return Result.ok<ResearchMetric>(
      new ResearchMetric(
        {
          metricType: typeRes.value,
          metricName: nameRes.value.value,
          value: valRes.value,
          measuredAt: props.measuredAt ?? new Date(),
        },
        id,
      ),
    );
  }
}
