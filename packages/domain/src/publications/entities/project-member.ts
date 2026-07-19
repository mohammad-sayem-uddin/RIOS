/**
 * ProjectMember Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import type { ProjectRole } from '../value-objects/publication-value-objects.js';

export interface ProjectMemberProps {
  profileId?: string;
  name: string;
  role: ProjectRole;
  startDate: Date;
  endDate?: Date;
}

export class ProjectMember extends Entity<ProjectMemberProps> {
  private constructor(props: ProjectMemberProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string | undefined {
    return this.props.profileId;
  }

  public get name(): string {
    return this.props.name;
  }

  public get role(): ProjectRole {
    return this.props.role;
  }

  public get startDate(): Date {
    return this.props.startDate;
  }

  public get endDate(): Date | undefined {
    return this.props.endDate;
  }

  public static create(
    props: {
      profileId?: string;
      name: string;
      role: ProjectRole;
      startDate: Date;
      endDate?: Date;
    },
    id?: UniqueId,
  ): Result<ProjectMember> {
    const trimmedName = props.name?.trim();
    if (!trimmedName) {
      return Result.fail<ProjectMember>('Project member name cannot be empty.');
    }
    if (props.endDate && props.endDate < props.startDate) {
      return Result.fail<ProjectMember>('End date cannot precede start date.');
    }

    return Result.ok<ProjectMember>(
      new ProjectMember(
        {
          profileId: props.profileId,
          name: trimmedName,
          role: props.role,
          startDate: props.startDate,
          endDate: props.endDate,
        },
        id,
      ),
    );
  }
}
