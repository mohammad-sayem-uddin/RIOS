/**
 * ResearchTrend Entity (Sprint 11)
 *
 * Represents a detected trend in research topics/metrics over time.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

export interface ResearchTrendProps {
  topic: string;
  growthRate: number;
  publicationCount: number;
  period: string;
  profileId?: string;
}

export class ResearchTrend extends Entity<ResearchTrendProps> {
  private constructor(props: ResearchTrendProps, id?: UniqueId) {
    super(props, id);
  }

  public get topic(): string {
    return this.props.topic;
  }

  public get growthRate(): number {
    return this.props.growthRate;
  }

  public get publicationCount(): number {
    return this.props.publicationCount;
  }

  public get period(): string {
    return this.props.period;
  }

  public get profileId(): string | undefined {
    return this.props.profileId;
  }

  public static create(
    props: {
      topic: string;
      growthRate: number;
      publicationCount: number;
      period: string;
      profileId?: string;
    },
    id?: UniqueId,
  ): Result<ResearchTrend> {
    if (props.topic.trim().length === 0) {
      return Result.fail<ResearchTrend>('Topic cannot be empty');
    }
    if (props.topic.length > 150) {
      return Result.fail<ResearchTrend>('Topic cannot exceed 150 characters');
    }

    return Result.ok<ResearchTrend>(
      new ResearchTrend(
        {
          topic: props.topic.trim(),
          growthRate: props.growthRate,
          publicationCount: props.publicationCount,
          period: props.period.trim(),
          profileId: props.profileId,
        },
        id,
      ),
    );
  }
}
