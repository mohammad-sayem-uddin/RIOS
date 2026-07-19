/**
 * ProfessionalActivity Aggregate Root
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import {
  EditorialRequiresOrganizationError,
  KeynoteRequiresConferenceError,
} from '../errors/academic-recognition-errors.js';
import {
  ConferenceParticipationAddedEvent,
  EditorialRoleAcceptedEvent,
  ProfessionalMembershipAddedEvent,
  ReviewerAssignmentAcceptedEvent,
} from '../events/academic-recognition-events.js';
import {
  ActivityCategoryType,
  ActivityId,
  ConferenceName,
  Country,
  OrganizationName,
  ProfessionalRole,
} from '../value-objects/academic-recognition-value-objects.js';

export interface ProfessionalActivityProps {
  profileId: UniqueId;
  category: ActivityCategoryType;
  title: string;
  organization?: OrganizationName;
  role?: ProfessionalRole;
  startDate?: Date;
  endDate?: Date;
  conferenceName?: ConferenceName;
  journalName?: string;
  country?: Country;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProfessionalActivity extends AggregateRoot<ProfessionalActivityProps> {
  private constructor(props: ProfessionalActivityProps, id?: UniqueId) {
    super(props, id);
  }

  public get activityId(): ActivityId {
    return ActivityId.fromUniqueId(this._id);
  }

  public get profileId(): UniqueId {
    return this.props.profileId;
  }

  public get category(): ActivityCategoryType {
    return this.props.category;
  }

  public get title(): string {
    return this.props.title;
  }

  public get organization(): OrganizationName | undefined {
    return this.props.organization;
  }

  public get role(): ProfessionalRole | undefined {
    return this.props.role;
  }

  public get startDate(): Date | undefined {
    return this.props.startDate;
  }

  public get endDate(): Date | undefined {
    return this.props.endDate;
  }

  public get conferenceName(): ConferenceName | undefined {
    return this.props.conferenceName;
  }

  public get journalName(): string | undefined {
    return this.props.journalName;
  }

  public get country(): Country | undefined {
    return this.props.country;
  }

  public get description(): string | undefined {
    return this.props.description;
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
      category: ActivityCategoryType;
      title: string;
      organization?: OrganizationName;
      role?: ProfessionalRole;
      startDate?: Date;
      endDate?: Date;
      conferenceName?: ConferenceName;
      journalName?: string;
      country?: Country;
      description?: string;
    },
    id?: UniqueId,
  ): Result<ProfessionalActivity> {
    if (
      props.category === ActivityCategoryType.KEYNOTE &&
      (!props.conferenceName || !props.conferenceName.value.trim())
    ) {
      return Result.fail<ProfessionalActivity>(new KeynoteRequiresConferenceError().message);
    }

    if (
      props.category === ActivityCategoryType.EDITORIAL &&
      (!props.organization || !props.organization.value.trim())
    ) {
      return Result.fail<ProfessionalActivity>(new EditorialRequiresOrganizationError().message);
    }

    const activityId = id ?? UniqueId.create();
    const activity = new ProfessionalActivity(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      activityId,
    );

    switch (props.category) {
      case ActivityCategoryType.MEMBERSHIP:
        activity.addDomainEvent(
          new ProfessionalMembershipAddedEvent(
            activity.activityId.value,
            activity.profileId.value,
            props.organization?.value ?? '',
            props.role?.value ?? '',
          ),
        );
        break;
      case ActivityCategoryType.EDITORIAL:
        activity.addDomainEvent(
          new EditorialRoleAcceptedEvent(
            activity.activityId.value,
            activity.profileId.value,
            props.organization?.value ?? '',
            props.role?.value ?? '',
          ),
        );
        break;
      case ActivityCategoryType.REVIEWER:
        activity.addDomainEvent(
          new ReviewerAssignmentAcceptedEvent(
            activity.activityId.value,
            activity.profileId.value,
            props.journalName ?? props.organization?.value ?? '',
          ),
        );
        break;
      case ActivityCategoryType.CONFERENCE:
      case ActivityCategoryType.KEYNOTE:
        activity.addDomainEvent(
          new ConferenceParticipationAddedEvent(
            activity.activityId.value,
            activity.profileId.value,
            props.conferenceName?.value ?? '',
            props.role?.value ?? '',
          ),
        );
        break;
      default:
        break;
    }

    return Result.ok<ProfessionalActivity>(activity);
  }
}
