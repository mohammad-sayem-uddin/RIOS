/**
 * CareerMilestone Entity (Sprint 11)
 *
 * Represents a significant career milestone for a researcher.
 */

import { Entity, UniqueId, Result } from '@rios/shared';

import {
  CareerMilestoneType,
  CareerMilestoneTypeValue,
  TimelineDate,
} from '../value-objects/research-intelligence-value-objects.js';

export interface CareerMilestoneProps {
  id: string;
  profileId: string;
  milestoneType: CareerMilestoneType;
  title: string;
  description: string;
  milestoneDate: TimelineDate;
  institution?: string;
  metadata?: Record<string, string>;
}

export class CareerMilestone extends Entity<CareerMilestoneProps> {
  private constructor(props: CareerMilestoneProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get milestoneType(): CareerMilestoneType {
    return this.props.milestoneType;
  }

  public get title(): string {
    return this.props.title;
  }

  public get description(): string {
    return this.props.description;
  }

  public get milestoneDate(): TimelineDate {
    return this.props.milestoneDate;
  }

  public get institution(): string | undefined {
    return this.props.institution;
  }

  public get metadata(): Record<string, string> | undefined {
    return this.props.metadata;
  }

  public updateTitle(title: string): Result<void> {
    if (title.trim().length === 0) {
      return Result.fail<void>('Career milestone title cannot be empty');
    }
    if (title.length > 300) {
      return Result.fail<void>('Career milestone title cannot exceed 300 characters');
    }
    this.props.title = title.trim();
    return Result.ok<void>(undefined);
  }

  public updateDescription(description: string): void {
    this.props.description = description;
  }

  public static create(props: {
    id: string;
    profileId: string;
    milestoneType: CareerMilestoneTypeValue;
    title: string;
    description: string;
    milestoneDate: Date;
    institution?: string;
    metadata?: Record<string, string>;
  }): Result<CareerMilestone> {
    if (props.title.trim().length === 0) {
      return Result.fail<CareerMilestone>('Career milestone title cannot be empty');
    }
    if (props.title.length > 300) {
      return Result.fail<CareerMilestone>('Career milestone title cannot exceed 300 characters');
    }
    if (props.profileId.trim().length === 0) {
      return Result.fail<CareerMilestone>('Profile ID is required');
    }

    const milestoneTypeResult = CareerMilestoneType.create(props.milestoneType);
    if (milestoneTypeResult.isFailure) {
      return Result.fail<CareerMilestone>(milestoneTypeResult.error);
    }

    const milestoneDateResult = TimelineDate.create(props.milestoneDate);
    if (milestoneDateResult.isFailure) {
      return Result.fail<CareerMilestone>(milestoneDateResult.error);
    }

    return Result.ok<CareerMilestone>(
      new CareerMilestone({
        id: props.id,
        profileId: props.profileId.trim(),
        milestoneType: milestoneTypeResult.value,
        title: props.title.trim(),
        description: props.description,
        milestoneDate: milestoneDateResult.value,
        institution: props.institution,
        metadata: props.metadata,
      }),
    );
  }
}
