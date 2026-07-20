/**
 * ResearchTrend Entity (Sprint 11)
 *
 * Represents a detected trend in research metrics over time.
 */

import { Entity, UniqueId, Result } from '@rios/shared';

import { MetricName, TimelineDate } from '../value-objects/research-intelligence-value-objects.js';

export type TrendDirection = 'rising' | 'declining' | 'stable' | 'volatile';

export interface ResearchTrendProps {
  id: string;
  profileId: string;
  metricName: MetricName;
  direction: TrendDirection;
  startValue: number;
  endValue: number;
  changePercentage: number;
  startDate: TimelineDate;
  endDate: TimelineDate;
  significance: number;
}

export class ResearchTrend extends Entity<ResearchTrendProps> {
  private constructor(props: ResearchTrendProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get metricName(): MetricName {
    return this.props.metricName;
  }

  public get direction(): TrendDirection {
    return this.props.direction;
  }

  public get startValue(): number {
    return this.props.startValue;
  }

  public get endValue(): number {
    return this.props.endValue;
  }

  public get changePercentage(): number {
    return this.props.changePercentage;
  }

  public get startDate(): TimelineDate {
    return this.props.startDate;
  }

  public get endDate(): TimelineDate {
    return this.props.endDate;
  }

  public get significance(): number {
    return this.props.significance;
  }

  public static create(props: {
    id: string;
    profileId: string;
    metricName: string;
    direction: TrendDirection;
    startValue: number;
    endValue: number;
    changePercentage: number;
    startDate: Date;
    endDate: Date;
    significance?: number;
  }): Result<ResearchTrend> {
    if (props.profileId.trim().length === 0) {
      return Result.fail<ResearchTrend>('Profile ID is required');
    }

    const metricNameResult = MetricName.create(props.metricName);
    if (metricNameResult.isFailure) {
      return Result.fail<ResearchTrend>(metricNameResult.error);
    }

    const validDirections: TrendDirection[] = ['rising', 'declining', 'stable', 'volatile'];
    if (!validDirections.includes(props.direction)) {
      return Result.fail<ResearchTrend>(
        `Invalid trend direction. Must be one of: ${validDirections.join(', ')}`,
      );
    }

    const startDateResult = TimelineDate.create(props.startDate);
    if (startDateResult.isFailure) {
      return Result.fail<ResearchTrend>(startDateResult.error);
    }

    const endDateResult = TimelineDate.create(props.endDate);
    if (endDateResult.isFailure) {
      return Result.fail<ResearchTrend>(endDateResult.error);
    }

    if (endDateResult.value.value.getTime() < startDateResult.value.value.getTime()) {
      return Result.fail<ResearchTrend>('End date cannot be before start date');
    }

    const significance = props.significance ?? 0;
    if (significance < 0 || significance > 1) {
      return Result.fail<ResearchTrend>('Significance must be between 0 and 1');
    }

    return Result.ok<ResearchTrend>(
      new ResearchTrend({
        id: props.id,
        profileId: props.profileId.trim(),
        metricName: metricNameResult.value,
        direction: props.direction,
        startValue: props.startValue,
        endValue: props.endValue,
        changePercentage: props.changePercentage,
        startDate: startDateResult.value,
        endDate: endDateResult.value,
        significance,
      }),
    );
  }
}
