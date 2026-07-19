/**
 * Patent Aggregate Root
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { InvalidPatentStatusTransitionError } from '../errors/academic-recognition-errors.js';
import { PatentFiledEvent, PatentGrantedEvent } from '../events/academic-recognition-events.js';
import {
  OrganizationName,
  PatentId,
  PatentNumber,
  PatentStatus,
  PatentStatusType,
  PatentType,
} from '../value-objects/academic-recognition-value-objects.js';

export interface PatentProps {
  profileId: UniqueId;
  patentNumber: PatentNumber;
  title: string;
  status: PatentStatus;
  patentType: PatentType;
  filingDate: Date;
  grantDate?: Date;
  assigneeOrganization?: OrganizationName;
  inventors: string[];
  abstract?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Patent extends AggregateRoot<PatentProps> {
  private constructor(props: PatentProps, id?: UniqueId) {
    super(props, id);
  }

  public get patentId(): PatentId {
    return PatentId.fromUniqueId(this._id);
  }

  public get profileId(): UniqueId {
    return this.props.profileId;
  }

  public get patentNumber(): PatentNumber {
    return this.props.patentNumber;
  }

  public get title(): string {
    return this.props.title;
  }

  public get status(): PatentStatus {
    return this.props.status;
  }

  public get patentType(): PatentType {
    return this.props.patentType;
  }

  public get filingDate(): Date {
    return this.props.filingDate;
  }

  public get grantDate(): Date | undefined {
    return this.props.grantDate;
  }

  public get assigneeOrganization(): OrganizationName | undefined {
    return this.props.assigneeOrganization;
  }

  public get inventors(): string[] {
    return [...this.props.inventors];
  }

  public get abstract(): string | undefined {
    return this.props.abstract;
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
      patentNumber: PatentNumber;
      title: string;
      status: PatentStatus;
      patentType: PatentType;
      filingDate: Date;
      grantDate?: Date;
      assigneeOrganization?: OrganizationName;
      inventors?: string[];
      abstract?: string;
    },
    id?: UniqueId,
  ): Result<Patent> {
    const patentId = id ?? UniqueId.create();
    const patent = new Patent(
      {
        ...props,
        inventors: props.inventors ?? [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      patentId,
    );

    patent.addDomainEvent(
      new PatentFiledEvent(
        patent.patentId.value,
        patent.profileId.value,
        patent.patentNumber.value,
        patent.title,
      ),
    );

    if (props.status.value === PatentStatusType.GRANTED && props.grantDate) {
      patent.addDomainEvent(
        new PatentGrantedEvent(patent.patentId.value, patent.patentNumber.value, props.grantDate),
      );
    }

    return Result.ok<Patent>(patent);
  }

  public updateStatus(nextStatus: PatentStatusType, grantDate?: Date): Result<void> {
    if (!this.props.status.canTransitionTo(nextStatus)) {
      return Result.fail<void>(
        new InvalidPatentStatusTransitionError(this.props.status.value, nextStatus).message,
      );
    }

    this.props.status = PatentStatus.create(nextStatus);
    if (nextStatus === PatentStatusType.GRANTED) {
      this.props.grantDate = grantDate ?? new Date();
      this.addDomainEvent(
        new PatentGrantedEvent(this.patentId.value, this.patentNumber.value, this.props.grantDate),
      );
    }
    this.props.updatedAt = new Date();

    return Result.ok();
  }
}
