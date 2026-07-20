/**
 * ResearchInterestHistory Entity (Sprint 11)
 *
 * Tracks the evolution of a researcher's interests over time.
 */

import { Entity, UniqueId, Result } from '@rios/shared';

import {
  ResearchDomain,
  TimelineDate,
} from '../value-objects/research-intelligence-value-objects.js';

export interface ResearchInterestHistoryProps {
  id: string;
  profileId: string;
  domain: ResearchDomain;
  startDate: TimelineDate;
  endDate?: TimelineDate;
  isActive: boolean;
}

export class ResearchInterestHistory extends Entity<ResearchInterestHistoryProps> {
  private constructor(props: ResearchInterestHistoryProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get domain(): ResearchDomain {
    return this.props.domain;
  }

  public get startDate(): TimelineDate {
    return this.props.startDate;
  }

  public get endDate(): TimelineDate | undefined {
    return this.props.endDate;
  }

  public get isActive(): boolean {
    return this.props.isActive;
  }

  public deactivate(endDate: TimelineDate): Result<void> {
    if (endDate.value.getTime() < this.props.startDate.value.getTime()) {
      return Result.fail<void>('End date cannot be before start date');
    }
    this.props.endDate = endDate;
    this.props.isActive = false;
    return Result.ok<void>(undefined);
  }

  public static create(props: {
    id: string;
    profileId: string;
    domain: string;
    startDate: Date;
    endDate?: Date;
    isActive?: boolean;
  }): Result<ResearchInterestHistory> {
    if (props.profileId.trim().length === 0) {
      return Result.fail<ResearchInterestHistory>('Profile ID is required');
    }

    const domainResult = ResearchDomain.create(props.domain);
    if (domainResult.isFailure) {
      return Result.fail<ResearchInterestHistory>(domainResult.error);
    }

    const startDateResult = TimelineDate.create(props.startDate);
    if (startDateResult.isFailure) {
      return Result.fail<ResearchInterestHistory>(startDateResult.error);
    }

    let endDateVO: TimelineDate | undefined;
    if (props.endDate) {
      const endDateResult = TimelineDate.create(props.endDate);
      if (endDateResult.isFailure) {
        return Result.fail<ResearchInterestHistory>(endDateResult.error);
      }
      endDateVO = endDateResult.value;
      if (endDateVO.value.getTime() < startDateResult.value.value.getTime()) {
        return Result.fail<ResearchInterestHistory>('End date cannot be before start date');
      }
    }

    const isActive = props.isActive ?? !props.endDate;

    return Result.ok<ResearchInterestHistory>(
      new ResearchInterestHistory({
        id: props.id,
        profileId: props.profileId.trim(),
        domain: domainResult.value,
        startDate: startDateResult.value,
        endDate: endDateVO,
        isActive,
      }),
    );
  }
}
