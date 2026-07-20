/**
 * InstitutionHistory Entity (Sprint 11)
 *
 * Represents a researcher's affiliation with an institution over time.
 */

import { Entity, UniqueId, Result } from '@rios/shared';

import {
  InstitutionId,
  TimelineDate,
} from '../value-objects/research-intelligence-value-objects.js';

export interface InstitutionHistoryProps {
  id: string;
  profileId: string;
  institutionId?: InstitutionId;
  institutionName: string;
  department?: string;
  position: string;
  startDate: TimelineDate;
  endDate?: TimelineDate;
  isCurrent: boolean;
}

export class InstitutionHistory extends Entity<InstitutionHistoryProps> {
  private constructor(props: InstitutionHistoryProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get institutionId(): InstitutionId | undefined {
    return this.props.institutionId;
  }

  public get institutionName(): string {
    return this.props.institutionName;
  }

  public get department(): string | undefined {
    return this.props.department;
  }

  public get position(): string {
    return this.props.position;
  }

  public get startDate(): TimelineDate {
    return this.props.startDate;
  }

  public get endDate(): TimelineDate | undefined {
    return this.props.endDate;
  }

  public get isCurrent(): boolean {
    return this.props.isCurrent;
  }

  public endAffiliation(endDate: TimelineDate): Result<void> {
    if (endDate.value.getTime() < this.props.startDate.value.getTime()) {
      return Result.fail<void>('End date cannot be before start date');
    }
    this.props.endDate = endDate;
    this.props.isCurrent = false;
    return Result.ok<void>(undefined);
  }

  public static create(props: {
    id: string;
    profileId: string;
    institutionId?: InstitutionId;
    institutionName: string;
    department?: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    isCurrent?: boolean;
  }): Result<InstitutionHistory> {
    if (props.institutionName.trim().length === 0) {
      return Result.fail<InstitutionHistory>('Institution name cannot be empty');
    }
    if (props.institutionName.length > 255) {
      return Result.fail<InstitutionHistory>('Institution name cannot exceed 255 characters');
    }
    if (props.profileId.trim().length === 0) {
      return Result.fail<InstitutionHistory>('Profile ID is required');
    }
    if (props.position.trim().length === 0) {
      return Result.fail<InstitutionHistory>('Position cannot be empty');
    }
    if (props.position.length > 255) {
      return Result.fail<InstitutionHistory>('Position cannot exceed 255 characters');
    }

    const startDateResult = TimelineDate.create(props.startDate);
    if (startDateResult.isFailure) {
      return Result.fail<InstitutionHistory>(startDateResult.error);
    }

    let endDateVO: TimelineDate | undefined;
    if (props.endDate) {
      const endDateResult = TimelineDate.create(props.endDate);
      if (endDateResult.isFailure) {
        return Result.fail<InstitutionHistory>(endDateResult.error);
      }
      endDateVO = endDateResult.value;
      if (endDateVO.value.getTime() < startDateResult.value.value.getTime()) {
        return Result.fail<InstitutionHistory>('End date cannot be before start date');
      }
    }

    const isCurrent = props.isCurrent ?? !props.endDate;

    return Result.ok<InstitutionHistory>(
      new InstitutionHistory({
        id: props.id,
        profileId: props.profileId.trim(),
        institutionId: props.institutionId,
        institutionName: props.institutionName.trim(),
        department: props.department?.trim(),
        position: props.position.trim(),
        startDate: startDateResult.value,
        endDate: endDateVO,
        isCurrent,
      }),
    );
  }
}
