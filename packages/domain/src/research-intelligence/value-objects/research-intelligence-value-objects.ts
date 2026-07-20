/**
 * Research Intelligence Value Objects (Sprint 11)
 *
 * Immutable value objects for the Research Intelligence bounded context.
 * Includes identifiers, metrics, and domain-specific value types.
 */

import { Result, ValueObject, UniqueId } from '@rios/shared';

// ─── Identifier Value Objects ──────────────────────────────────────────

export class TimelineEventId extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static fromUniqueId(id: UniqueId): TimelineEventId {
    return new TimelineEventId({ value: id.value });
  }

  public static fromString(id: string): TimelineEventId {
    return new TimelineEventId({ value: id });
  }
}

export class CollaborationId extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static fromUniqueId(id: UniqueId): CollaborationId {
    return new CollaborationId({ value: id.value });
  }

  public static fromString(id: string): CollaborationId {
    return new CollaborationId({ value: id });
  }
}

export class AnalyticsId extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static fromUniqueId(id: UniqueId): AnalyticsId {
    return new AnalyticsId({ value: id.value });
  }

  public static fromString(id: string): AnalyticsId {
    return new AnalyticsId({ value: id });
  }
}

export class ResearchMetricId extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static fromUniqueId(id: UniqueId): ResearchMetricId {
    return new ResearchMetricId({ value: id.value });
  }

  public static fromString(id: string): ResearchMetricId {
    return new ResearchMetricId({ value: id });
  }
}

export class InstitutionId extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static fromUniqueId(id: UniqueId): InstitutionId {
    return new InstitutionId({ value: id.value });
  }

  public static fromString(id: string): InstitutionId {
    return new InstitutionId({ value: id });
  }
}

// ─── Domain Value Objects ──────────────────────────────────────────────

export class ResearchYear extends ValueObject<{ value: number }> {
  private constructor(props: { value: number }) {
    super(props);
  }

  public get value(): number {
    return this.props.value;
  }

  public static create(year: number): Result<ResearchYear> {
    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      return Result.fail<ResearchYear>('Research year must be an integer between 1900 and 2100');
    }
    return Result.ok<ResearchYear>(new ResearchYear({ value: year }));
  }
}

export class HIndex extends ValueObject<{ value: number }> {
  private constructor(props: { value: number }) {
    super(props);
  }

  public get value(): number {
    return this.props.value;
  }

  public static create(index: number, publicationCount?: number): Result<HIndex> {
    if (!Number.isInteger(index) || index < 0) {
      return Result.fail<HIndex>('H-index cannot be negative');
    }
    if (publicationCount !== undefined && index > publicationCount) {
      return Result.fail<HIndex>('H-index cannot exceed publication count');
    }
    return Result.ok<HIndex>(new HIndex({ value: index }));
  }
}

export class I10Index extends ValueObject<{ value: number }> {
  private constructor(props: { value: number }) {
    super(props);
  }

  public get value(): number {
    return this.props.value;
  }

  public static create(index: number): Result<I10Index> {
    if (!Number.isInteger(index) || index < 0) {
      return Result.fail<I10Index>('I10-index cannot be negative');
    }
    return Result.ok<I10Index>(new I10Index({ value: index }));
  }
}

export class RGScore extends ValueObject<{ value: number }> {
  private constructor(props: { value: number }) {
    super(props);
  }

  public get value(): number {
    return this.props.value;
  }

  public static create(score: number): Result<RGScore> {
    if (score < 0) {
      return Result.fail<RGScore>('RGScore cannot be negative');
    }
    return Result.ok<RGScore>(new RGScore({ value: score }));
  }
}

export class ImpactScore extends ValueObject<{ value: number }> {
  private constructor(props: { value: number }) {
    super(props);
  }

  public get value(): number {
    return this.props.value;
  }

  public static create(score: number): Result<ImpactScore> {
    if (score < 0) {
      return Result.fail<ImpactScore>('Impact score cannot be negative');
    }
    return Result.ok<ImpactScore>(new ImpactScore({ value: score }));
  }
}

export type CollaborationStrengthType = 'weak' | 'moderate' | 'strong' | 'very_strong';

export class CollaborationStrength extends ValueObject<{ value: CollaborationStrengthType }> {
  private constructor(props: { value: CollaborationStrengthType }) {
    super(props);
  }

  public get value(): CollaborationStrengthType {
    return this.props.value;
  }

  public static create(strength: CollaborationStrengthType): Result<CollaborationStrength> {
    const valid: CollaborationStrengthType[] = ['weak', 'moderate', 'strong', 'very_strong'];
    if (!valid.includes(strength)) {
      return Result.fail<CollaborationStrength>(
        `Invalid collaboration strength. Must be one of: ${valid.join(', ')}`,
      );
    }
    return Result.ok<CollaborationStrength>(new CollaborationStrength({ value: strength }));
  }
}

export class ResearchDomain extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(domain: string): Result<ResearchDomain> {
    if (domain.trim().length === 0) {
      return Result.fail<ResearchDomain>('Research domain cannot be empty');
    }
    if (domain.length > 200) {
      return Result.fail<ResearchDomain>('Research domain cannot exceed 200 characters');
    }
    return Result.ok<ResearchDomain>(new ResearchDomain({ value: domain.trim() }));
  }
}

export class TimelineDate extends ValueObject<{ value: Date }> {
  private constructor(props: { value: Date }) {
    super(props);
  }

  public get value(): Date {
    return this.props.value;
  }

  public static create(date: Date): Result<TimelineDate> {
    if (isNaN(date.getTime())) {
      return Result.fail<TimelineDate>('Invalid date');
    }
    return Result.ok<TimelineDate>(new TimelineDate({ value: date }));
  }
}

export class MetricValue extends ValueObject<{ value: number }> {
  private constructor(props: { value: number }) {
    super(props);
  }

  public get value(): number {
    return this.props.value;
  }

  public static create(value: number): Result<MetricValue> {
    if (value < 0) {
      return Result.fail<MetricValue>('Metric value cannot be negative');
    }
    return Result.ok<MetricValue>(new MetricValue({ value }));
  }
}

export type MetricTypeValue =
  'h_index' | 'i10_index' | 'citation_count' | 'publication_count' | 'rg_score' | 'impact_factor';

export class MetricType extends ValueObject<{ value: MetricTypeValue }> {
  private constructor(props: { value: MetricTypeValue }) {
    super(props);
  }

  public get value(): MetricTypeValue {
    return this.props.value;
  }

  public static create(type: MetricTypeValue): Result<MetricType> {
    const valid: MetricTypeValue[] = [
      'h_index',
      'i10_index',
      'citation_count',
      'publication_count',
      'rg_score',
      'impact_factor',
    ];
    if (!valid.includes(type)) {
      return Result.fail<MetricType>(`Invalid metric type. Must be one of: ${valid.join(', ')}`);
    }
    return Result.ok<MetricType>(new MetricType({ value: type }));
  }
}

export type TimelineEventTypeValue =
  | 'publication'
  | 'award'
  | 'grant'
  | 'patent'
  | 'conference'
  | 'position_change'
  | 'institution_change'
  | 'education'
  | 'collaboration'
  | 'other';

export class TimelineEventType extends ValueObject<{ value: TimelineEventTypeValue }> {
  private constructor(props: { value: TimelineEventTypeValue }) {
    super(props);
  }

  public get value(): TimelineEventTypeValue {
    return this.props.value;
  }

  public static create(type: TimelineEventTypeValue): Result<TimelineEventType> {
    const valid: TimelineEventTypeValue[] = [
      'publication',
      'award',
      'grant',
      'patent',
      'conference',
      'position_change',
      'institution_change',
      'education',
      'collaboration',
      'other',
    ];
    if (!valid.includes(type)) {
      return Result.fail<TimelineEventType>(
        `Invalid timeline event type. Must be one of: ${valid.join(', ')}`,
      );
    }
    return Result.ok<TimelineEventType>(new TimelineEventType({ value: type }));
  }
}

export class MetricName extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<MetricName> {
    if (name.trim().length === 0) {
      return Result.fail<MetricName>('Metric name cannot be empty');
    }
    if (name.length > 100) {
      return Result.fail<MetricName>('Metric name cannot exceed 100 characters');
    }
    return Result.ok<MetricName>(new MetricName({ value: name.trim() }));
  }
}

export type CareerMilestoneTypeValue =
  | 'first_publication'
  | 'phd_completion'
  | 'first_grant'
  | 'tenure'
  | 'promotion'
  | 'award'
  | 'patent_granted'
  | 'editorial_role'
  | 'keynote'
  | 'other';

export class CareerMilestoneType extends ValueObject<{ value: CareerMilestoneTypeValue }> {
  private constructor(props: { value: CareerMilestoneTypeValue }) {
    super(props);
  }

  public get value(): CareerMilestoneTypeValue {
    return this.props.value;
  }

  public static create(type: CareerMilestoneTypeValue): Result<CareerMilestoneType> {
    const valid: CareerMilestoneTypeValue[] = [
      'first_publication',
      'phd_completion',
      'first_grant',
      'tenure',
      'promotion',
      'award',
      'patent_granted',
      'editorial_role',
      'keynote',
      'other',
    ];
    if (!valid.includes(type)) {
      return Result.fail<CareerMilestoneType>(
        `Invalid career milestone type. Must be one of: ${valid.join(', ')}`,
      );
    }
    return Result.ok<CareerMilestoneType>(new CareerMilestoneType({ value: type }));
  }
}
