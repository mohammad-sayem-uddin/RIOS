/**
 * AcademicTimeline Aggregate Root (Sprint 11)
 *
 * Manages the complete academic timeline for a researcher,
 * including career milestones, timeline events, institution history,
 * and research interest history.
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { CareerMilestone } from '../entities/career-milestone.js';
import { InstitutionHistory } from '../entities/institution-history.js';
import { ResearchInterestHistory } from '../entities/research-interest-history.js';
import { TimelineEvent } from '../entities/timeline-event.js';
import {
  CareerMilestoneAddedEvent,
  TimelineEventAddedEvent,
} from '../events/research-intelligence-events.js';

export interface AcademicTimelineProps {
  profileId: string;
  events: TimelineEvent[];
  milestones: CareerMilestone[];
  institutionHistory: InstitutionHistory[];
  researchInterestHistory: ResearchInterestHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export class AcademicTimeline extends AggregateRoot<AcademicTimelineProps> {
  private constructor(props: AcademicTimelineProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get events(): ReadonlyArray<TimelineEvent> {
    return [...this.props.events];
  }

  public get milestones(): ReadonlyArray<CareerMilestone> {
    return [...this.props.milestones];
  }

  public get institutionHistory(): ReadonlyArray<InstitutionHistory> {
    return [...this.props.institutionHistory];
  }

  public get researchInterestHistory(): ReadonlyArray<ResearchInterestHistory> {
    return [...this.props.researchInterestHistory];
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public addEvent(event: TimelineEvent): void {
    this.props.events.push(event);
    this.props.updatedAt = new Date();

    const domainEvent = new TimelineEventAddedEvent(this.id.toString(), this.props.profileId, {
      eventId: event.id.value,
      eventType: event.eventType.value,
      title: event.title,
      eventDate: event.eventDate.value.toISOString(),
    });
    this.addDomainEvent(domainEvent);
  }

  public addMilestone(milestone: CareerMilestone): void {
    this.props.milestones.push(milestone);
    this.props.updatedAt = new Date();

    const domainEvent = new CareerMilestoneAddedEvent(this.id.toString(), this.props.profileId, {
      milestoneId: milestone.id.value,
      milestoneType: milestone.milestoneType.value,
      title: milestone.title,
      eventDate: milestone.milestoneDate.value.toISOString(),
    });
    this.addDomainEvent(domainEvent);
  }

  public addInstitutionAffiliation(history: InstitutionHistory): void {
    this.props.institutionHistory.push(history);
    this.props.updatedAt = new Date();
  }

  public addResearchInterest(history: ResearchInterestHistory): void {
    this.props.researchInterestHistory.push(history);
    this.props.updatedAt = new Date();
  }

  public getEventsByDateRange(startDate: Date, endDate: Date): TimelineEvent[] {
    return this.props.events.filter((event) => {
      const eventDate = event.eventDate.value;
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  public getMilestonesByType(type: string): CareerMilestone[] {
    return this.props.milestones.filter((m) => m.milestoneType.value === type);
  }

  public getCurrentInstitutions(): InstitutionHistory[] {
    return this.props.institutionHistory.filter((ih) => ih.isCurrent);
  }

  public getActiveResearchInterests(): ResearchInterestHistory[] {
    return this.props.researchInterestHistory.filter((ri) => ri.isActive);
  }

  public static create(props: {
    id?: string;
    profileId: string;
    events?: TimelineEvent[];
    milestones?: CareerMilestone[];
    institutionHistory?: InstitutionHistory[];
    researchInterestHistory?: ResearchInterestHistory[];
  }): Result<AcademicTimeline> {
    if (props.profileId.trim().length === 0) {
      return Result.fail<AcademicTimeline>('Profile ID is required');
    }

    const id =
      props.id !== undefined && props.id.trim().length > 0
        ? UniqueId.from(props.id)
        : UniqueId.create();
    const now = new Date();

    const timeline = new AcademicTimeline(
      {
        profileId: props.profileId.trim(),
        events: props.events ?? [],
        milestones: props.milestones ?? [],
        institutionHistory: props.institutionHistory ?? [],
        researchInterestHistory: props.researchInterestHistory ?? [],
        createdAt: now,
        updatedAt: now,
      },
      id,
    );

    return Result.ok<AcademicTimeline>(timeline);
  }
}
