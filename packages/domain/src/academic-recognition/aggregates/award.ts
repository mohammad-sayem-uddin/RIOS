/**
 * Award Aggregate Root
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { AwardReceivedEvent } from '../events/academic-recognition-events.js';
import {
  AwardCategory,
  AwardCategoryType,
  AwardId,
  AwardTitle,
  FundingAmount,
  OrganizationName,
} from '../value-objects/academic-recognition-value-objects.js';

export interface AwardProps {
  profileId: UniqueId;
  title: AwardTitle;
  category: AwardCategory;
  sponsorOrAgency?: OrganizationName;
  amount?: FundingAmount;
  awardDate: Date;
  description?: string;
  field?: string;
  area?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Award extends AggregateRoot<AwardProps> {
  private constructor(props: AwardProps, id?: UniqueId) {
    super(props, id);
  }

  public get awardId(): AwardId {
    return AwardId.fromUniqueId(this._id);
  }

  public get profileId(): UniqueId {
    return this.props.profileId;
  }

  public get title(): string {
    return this.props.title.value;
  }

  public get category(): AwardCategoryType {
    return this.props.category.value;
  }

  public get sponsorOrAgency(): OrganizationName | undefined {
    return this.props.sponsorOrAgency;
  }

  public get amount(): FundingAmount | undefined {
    return this.props.amount;
  }

  public get awardDate(): Date {
    return this.props.awardDate;
  }

  public get description(): string | undefined {
    return this.props.description;
  }

  public get field(): string | undefined {
    return this.props.field;
  }

  public get area(): string | undefined {
    return this.props.area;
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
      title: AwardTitle;
      category: AwardCategory;
      sponsorOrAgency?: OrganizationName;
      amount?: FundingAmount;
      awardDate?: Date;
      description?: string;
      field?: string;
      area?: string;
    },
    id?: UniqueId,
  ): Result<Award> {
    const awardId = id ?? UniqueId.create();
    const awardDate = props.awardDate ?? new Date();

    const award = new Award(
      {
        ...props,
        awardDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      awardId,
    );

    award.addDomainEvent(
      new AwardReceivedEvent(
        award.awardId.value,
        award.profileId.value,
        award.title,
        award.category,
      ),
    );

    return Result.ok<Award>(award);
  }
}
