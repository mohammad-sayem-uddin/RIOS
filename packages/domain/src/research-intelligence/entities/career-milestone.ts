/**
 * CareerMilestone Entity (Sprint 11)
 *
 * Represents a significant career milestone for a researcher.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import {
  CareerMilestoneType,
  CareerMilestoneTypeValue,
  TimelineDate,
} from '../value-objects/research-intelligence-value-objects.js';

export interface CareerMilestoneProps {
  milestoneType: CareerMilestoneType;
  title: string;
  milestoneDate: TimelineDate;
  description?: string;
  institution?: string;
  profileId?: string;
}

export class CareerMilestone extends Entity<CareerMilestoneProps> {
  private constructor(props: CareerMilestoneProps, id?: UniqueId) {
    super(props, id);
  }

  public get milestoneType(): CareerMilestoneType {
    return this.props.milestoneType;
  }

  public get title(): string {
    return this.props.title;
  }

  public get description(): string | undefined {
    return this.props.description;
  }

  public get milestoneDate(): TimelineDate {
    return this.props.milestoneDate;
  }

  public get institution(): string | undefined {
    return this.props.institution;
  }

  public get profileId(): string | undefined {
    return this.props.profileId;
  }

  public static create(
    props: {
      milestoneType: CareerMilestoneType | CareerMilestoneTypeValue;
      title: string;
      milestoneDate: Date;
      description?: string;
      institution?: string;
      profileId?: string;
    },
    id?: UniqueId,
  ): Result<CareerMilestone> {
    if (props.title.trim().length === 0) {
      return Result.fail<CareerMilestone>('Career milestone title cannot be empty');
    }
    if (props.title.length > 300) {
      return Result.fail<CareerMilestone>('Career milestone title cannot exceed 300 characters');
    }

    const milestoneTypeRes =
      props.milestoneType instanceof CareerMilestoneType
        ? Result.ok(props.milestoneType)
        : CareerMilestoneType.create(props.milestoneType);

    if (milestoneTypeRes.isFailure) {
      return Result.fail<CareerMilestone>(milestoneTypeRes.error);
    }

    const milestoneDateResult = TimelineDate.create(props.milestoneDate);
    if (milestoneDateResult.isFailure) {
      return Result.fail<CareerMilestone>(milestoneDateResult.error);
    }

    return Result.ok<CareerMilestone>(
      new CareerMilestone(
        {
          milestoneType: milestoneTypeRes.value,
          title: props.title.trim(),
          description: props.description,
          milestoneDate: milestoneDateResult.value,
          institution: props.institution,
          profileId: props.profileId,
        },
        id,
      ),
    );
  }
}
