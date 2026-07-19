/**
 * Grant Aggregate Root
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { InvalidGrantDateSequenceError } from '../errors/academic-recognition-errors.js';
import { GrantAwardedEvent, GrantCompletedEvent } from '../events/academic-recognition-events.js';
import {
  FundingAmount,
  GrantId,
  GrantNumber,
  OrganizationName,
} from '../value-objects/academic-recognition-value-objects.js';

export enum GrantStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
}

export interface GrantProps {
  profileId: UniqueId;
  grantNumber: GrantNumber;
  title: string;
  fundingAgency: OrganizationName;
  amount: FundingAmount;
  startDate: Date;
  endDate: Date;
  status: GrantStatus;
  principalInvestigatorId?: string;
  coInvestigators: string[];
  description?: string;
  deliverables: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class Grant extends AggregateRoot<GrantProps> {
  private constructor(props: GrantProps, id?: UniqueId) {
    super(props, id);
  }

  public get grantId(): GrantId {
    return GrantId.fromUniqueId(this._id);
  }

  public get profileId(): UniqueId {
    return this.props.profileId;
  }

  public get grantNumber(): GrantNumber {
    return this.props.grantNumber;
  }

  public get title(): string {
    return this.props.title;
  }

  public get fundingAgency(): OrganizationName {
    return this.props.fundingAgency;
  }

  public get amount(): FundingAmount {
    return this.props.amount;
  }

  public get startDate(): Date {
    return this.props.startDate;
  }

  public get endDate(): Date {
    return this.props.endDate;
  }

  public get status(): GrantStatus {
    return this.props.status;
  }

  public get principalInvestigatorId(): string | undefined {
    return this.props.principalInvestigatorId;
  }

  public get coInvestigators(): string[] {
    return [...this.props.coInvestigators];
  }

  public get description(): string | undefined {
    return this.props.description;
  }

  public get deliverables(): string[] {
    return [...this.props.deliverables];
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
      grantNumber: GrantNumber;
      title: string;
      fundingAgency: OrganizationName;
      amount: FundingAmount;
      startDate: Date;
      endDate: Date;
      status?: GrantStatus;
      principalInvestigatorId?: string;
      coInvestigators?: string[];
      description?: string;
      deliverables?: string[];
    },
    id?: UniqueId,
  ): Result<Grant> {
    if (props.endDate.getTime() <= props.startDate.getTime()) {
      return Result.fail<Grant>(
        new InvalidGrantDateSequenceError(props.startDate, props.endDate).message,
      );
    }

    const grantId = id ?? UniqueId.create();
    const grant = new Grant(
      {
        ...props,
        status: props.status ?? GrantStatus.ACTIVE,
        coInvestigators: props.coInvestigators ?? [],
        deliverables: props.deliverables ?? [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      grantId,
    );

    grant.addDomainEvent(
      new GrantAwardedEvent(
        grant.grantId.value,
        grant.profileId.value,
        grant.grantNumber.value,
        grant.amount.amount,
        grant.amount.currency.code,
      ),
    );

    return Result.ok<Grant>(grant);
  }

  public markCompleted(): Result<void> {
    this.props.status = GrantStatus.COMPLETED;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new GrantCompletedEvent(this.grantId.value, new Date()));

    return Result.ok();
  }
}
