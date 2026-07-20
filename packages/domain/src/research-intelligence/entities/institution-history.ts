/**
 * InstitutionHistory Entity (Sprint 11)
 *
 * Represents a researcher's affiliation with an institution over time.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

export interface InstitutionHistoryProps {
  institutionName: string;
  role?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  profileId?: string;
}

export class InstitutionHistory extends Entity<InstitutionHistoryProps> {
  private constructor(props: InstitutionHistoryProps, id?: UniqueId) {
    super(props, id);
  }

  public get institutionName(): string {
    return this.props.institutionName;
  }

  public get role(): string | undefined {
    return this.props.role;
  }

  public get startDate(): Date {
    return this.props.startDate;
  }

  public get endDate(): Date | undefined {
    return this.props.endDate;
  }

  public get isCurrent(): boolean {
    return this.props.isCurrent;
  }

  public get profileId(): string | undefined {
    return this.props.profileId;
  }

  public static create(
    props: {
      institutionName: string;
      role?: string;
      startDate: Date;
      endDate?: Date;
      isCurrent?: boolean;
      profileId?: string;
    },
    id?: UniqueId,
  ): Result<InstitutionHistory> {
    if (props.institutionName.trim().length === 0) {
      return Result.fail<InstitutionHistory>('Institution name cannot be empty');
    }
    if (props.institutionName.length > 255) {
      return Result.fail<InstitutionHistory>('Institution name cannot exceed 255 characters');
    }

    if (props.endDate && props.endDate.getTime() < props.startDate.getTime()) {
      return Result.fail<InstitutionHistory>('End date cannot be before start date');
    }

    const isCurrent = props.isCurrent ?? !props.endDate;

    return Result.ok<InstitutionHistory>(
      new InstitutionHistory(
        {
          institutionName: props.institutionName.trim(),
          role: props.role,
          startDate: props.startDate,
          endDate: props.endDate,
          isCurrent,
          profileId: props.profileId,
        },
        id,
      ),
    );
  }
}
