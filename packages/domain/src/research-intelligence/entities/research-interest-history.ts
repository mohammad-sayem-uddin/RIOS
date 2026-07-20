/**
 * ResearchInterestHistory Entity (Sprint 11)
 *
 * Tracks the evolution of a researcher's interests over time.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

export interface ResearchInterestHistoryProps {
  topic: string;
  startedDate: Date;
  endedDate?: Date;
  isActive: boolean;
  profileId?: string;
}

export class ResearchInterestHistory extends Entity<ResearchInterestHistoryProps> {
  private constructor(props: ResearchInterestHistoryProps, id?: UniqueId) {
    super(props, id);
  }

  public get topic(): string {
    return this.props.topic;
  }

  public get domain(): string {
    return this.props.topic;
  }

  public get startedDate(): Date {
    return this.props.startedDate;
  }

  public get startDate(): Date {
    return this.props.startedDate;
  }

  public get endedDate(): Date | undefined {
    return this.props.endedDate;
  }

  public get endDate(): Date | undefined {
    return this.props.endedDate;
  }

  public get isActive(): boolean {
    return this.props.isActive;
  }

  public get profileId(): string | undefined {
    return this.props.profileId;
  }

  public static create(
    props: {
      topic?: string;
      domain?: string;
      startedDate?: Date;
      startDate?: Date;
      endedDate?: Date;
      endDate?: Date;
      isActive?: boolean;
      profileId?: string;
    },
    id?: UniqueId,
  ): Result<ResearchInterestHistory> {
    const topic = (props.topic ?? props.domain ?? '').trim();
    if (topic.length === 0) {
      return Result.fail<ResearchInterestHistory>('Research topic/domain cannot be empty');
    }

    const start = props.startedDate ?? props.startDate ?? new Date();
    const end = props.endedDate ?? props.endDate;

    if (end && end.getTime() < start.getTime()) {
      return Result.fail<ResearchInterestHistory>('End date cannot be before start date');
    }

    const isActive = props.isActive ?? !end;

    return Result.ok<ResearchInterestHistory>(
      new ResearchInterestHistory(
        {
          topic,
          startedDate: start,
          endedDate: end,
          isActive,
          profileId: props.profileId,
        },
        id,
      ),
    );
  }
}
