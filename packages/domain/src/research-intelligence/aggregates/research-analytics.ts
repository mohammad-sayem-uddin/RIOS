/**
 * ResearchAnalytics Aggregate Root (Sprint 11)
 *
 * Manages research statistics, publication/citation statistics,
 * metrics (h-index, i10-index, RG score, impact score), and research trends.
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { CitationStatistic } from '../entities/citation-statistic.js';
import { PublicationStatistic } from '../entities/publication-statistic.js';
import { ResearchMetric } from '../entities/research-metric.js';
import { ResearchTrend } from '../entities/research-trend.js';
import {
  AnalyticsCalculatedEvent,
  ResearchImpactUpdatedEvent,
} from '../events/research-intelligence-events.js';

export interface ResearchAnalyticsProps {
  profileId: string;
  publicationStats: PublicationStatistic[];
  citationStats: CitationStatistic[];
  metrics: ResearchMetric[];
  trends: ResearchTrend[];
  createdAt: Date;
  updatedAt: Date;
}

export class ResearchAnalytics extends AggregateRoot<ResearchAnalyticsProps> {
  private constructor(props: ResearchAnalyticsProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get publicationStats(): ReadonlyArray<PublicationStatistic> {
    return [...this.props.publicationStats];
  }

  public get citationStats(): ReadonlyArray<CitationStatistic> {
    return [...this.props.citationStats];
  }

  public get metrics(): ReadonlyArray<ResearchMetric> {
    return [...this.props.metrics];
  }

  public get trends(): ReadonlyArray<ResearchTrend> {
    return [...this.props.trends];
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public addPublicationStatistic(stat: PublicationStatistic): void {
    this.props.publicationStats.push(stat);
    this.props.updatedAt = new Date();
  }

  public addCitationStatistic(stat: CitationStatistic): void {
    this.props.citationStats.push(stat);
    this.props.updatedAt = new Date();
  }

  public addResearchMetric(metric: ResearchMetric): Result<void> {
    const metricTypeValue = metric.metricType.value;
    const numericValue = metric.value.value;

    if (metricTypeValue === 'h_index') {
      const totalPubs = this.props.publicationStats.reduce((acc, curr) => acc + curr.count, 0);
      if (totalPubs > 0 && numericValue > totalPubs) {
        return Result.fail<void>('H-index cannot exceed total publication count');
      }
    }

    this.props.metrics.push(metric);
    this.props.updatedAt = new Date();

    if (metricTypeValue === 'h_index' || metricTypeValue === 'citation_count') {
      const hIndex = this.getMetricValue('h_index');
      const citationCount = this.getMetricValue('citation_count');
      this.addDomainEvent(
        new AnalyticsCalculatedEvent(this.id.value, this.props.profileId, hIndex, citationCount),
      );
    } else if (metricTypeValue === 'impact_factor' || metricTypeValue === 'rg_score') {
      this.addDomainEvent(
        new ResearchImpactUpdatedEvent(this.id.value, this.props.profileId, numericValue),
      );
    }

    return Result.ok<void>(undefined);
  }

  public addResearchTrend(trend: ResearchTrend): void {
    this.props.trends.push(trend);
    this.props.updatedAt = new Date();
  }

  public getMetricValue(metricType: string): number {
    const metric = this.props.metrics.find((m) => m.metricType.value === metricType);
    return metric !== undefined ? metric.value.value : 0;
  }

  public static create(props: {
    id?: string;
    profileId: string;
    publicationStats?: PublicationStatistic[];
    citationStats?: CitationStatistic[];
    metrics?: ResearchMetric[];
    trends?: ResearchTrend[];
  }): Result<ResearchAnalytics> {
    if (props.profileId.trim().length === 0) {
      return Result.fail<ResearchAnalytics>('Profile ID is required');
    }

    const id =
      props.id !== undefined && props.id.trim().length > 0
        ? UniqueId.from(props.id)
        : UniqueId.create();
    const now = new Date();

    const analytics = new ResearchAnalytics(
      {
        profileId: props.profileId.trim(),
        publicationStats: props.publicationStats ?? [],
        citationStats: props.citationStats ?? [],
        metrics: props.metrics ?? [],
        trends: props.trends ?? [],
        createdAt: now,
        updatedAt: now,
      },
      id,
    );

    return Result.ok<ResearchAnalytics>(analytics);
  }
}
