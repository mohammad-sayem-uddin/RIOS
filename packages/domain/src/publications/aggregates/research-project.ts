/**
 * ResearchProject Aggregate Root
 *
 * Aggregate root managing research projects, team members, grants, and deliverables.
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import type { ProjectMember } from '../entities/project-member.js';
import {
  ProjectCompleted,
  ProjectCreated,
  ProjectMemberAdded,
  ProjectMemberRemoved,
} from '../events/publications-events.js';
import { FundingIdentifier, ProjectId } from '../value-objects/publication-value-objects.js';

export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';

export interface ResearchProjectProps {
  profileId: UniqueId;
  title: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  grantIdentifier?: FundingIdentifier;
  fundingAgency?: string;
  budget?: number;
  members: ProjectMember[];
  createdAt: Date;
  updatedAt: Date;
}

export class ResearchProject extends AggregateRoot<ResearchProjectProps> {
  private constructor(props: ResearchProjectProps, id: UniqueId) {
    super(props, id);
  }

  public get projectId(): ProjectId {
    return ProjectId.from(this._id.value);
  }

  public get profileId(): UniqueId {
    return this.props.profileId;
  }

  public get title(): string {
    return this.props.title;
  }

  public get description(): string {
    return this.props.description;
  }

  public get status(): ProjectStatus {
    return this.props.status;
  }

  public get startDate(): Date {
    return this.props.startDate;
  }

  public get endDate(): Date | undefined {
    return this.props.endDate;
  }

  public get grantIdentifier(): FundingIdentifier | undefined {
    return this.props.grantIdentifier;
  }

  public get fundingAgency(): string | undefined {
    return this.props.fundingAgency;
  }

  public get budget(): number | undefined {
    return this.props.budget;
  }

  public get members(): ProjectMember[] {
    return [...this.props.members];
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static create(
    props: {
      profileId: UniqueId;
      title: string;
      description: string;
      status?: ProjectStatus;
      startDate: Date;
      endDate?: Date;
      grantIdentifier?: FundingIdentifier;
      fundingAgency?: string;
      budget?: number;
      members: ProjectMember[];
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: UniqueId,
  ): Result<ResearchProject> {
    const titleTrimmed = props.title?.trim();
    if (!titleTrimmed) {
      return Result.fail<ResearchProject>('Research project title cannot be empty.');
    }
    const descTrimmed = props.description?.trim();
    if (!descTrimmed) {
      return Result.fail<ResearchProject>('Research project description cannot be empty.');
    }

    // Must have at least one Principal Investigator
    const hasPI = props.members.some((m) => m.role.isPI());
    if (!hasPI) {
      return Result.fail<ResearchProject>('A research project requires a Principal Investigator.');
    }

    if (props.endDate && props.endDate < props.startDate) {
      return Result.fail<ResearchProject>('End date cannot precede start date.');
    }

    const projectId = id ?? UniqueId.create();
    const now = new Date();
    const project = new ResearchProject(
      {
        profileId: props.profileId,
        title: titleTrimmed,
        description: descTrimmed,
        status: props.status ?? 'ACTIVE',
        startDate: props.startDate,
        endDate: props.endDate,
        grantIdentifier: props.grantIdentifier,
        fundingAgency: props.fundingAgency?.trim(),
        budget: props.budget !== undefined ? Math.max(0, props.budget) : undefined,
        members: props.members,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      projectId,
    );

    if (!id) {
      project.addDomainEvent(
        new ProjectCreated(projectId.value, props.profileId.value, titleTrimmed),
      );
    }

    return Result.ok<ResearchProject>(project);
  }

  public complete(endDate: Date): Result<void> {
    if (endDate < this.props.startDate) {
      return Result.fail<void>('End date cannot precede start date.');
    }
    this.props.status = 'COMPLETED';
    this.props.endDate = endDate;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ProjectCompleted(this._id.value, endDate));
    return Result.ok<void>();
  }

  public addMember(member: ProjectMember): Result<void> {
    this.props.members.push(member);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ProjectMemberAdded(this._id.value, member.id.value, member.role.value));
    return Result.ok<void>();
  }

  public removeMember(memberId: string): Result<void> {
    const memberToRemove = this.props.members.find((m) => m.id.value === memberId);
    if (memberToRemove && memberToRemove.role.isPI()) {
      const remainingPIs = this.props.members.filter(
        (m) => m.id.value !== memberId && m.role.isPI(),
      );
      if (remainingPIs.length === 0) {
        return Result.fail<void>(
          'Cannot remove the sole Principal Investigator of a research project.',
        );
      }
    }

    this.props.members = this.props.members.filter((m) => m.id.value !== memberId);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ProjectMemberRemoved(this._id.value, memberId));
    return Result.ok<void>();
  }
}
