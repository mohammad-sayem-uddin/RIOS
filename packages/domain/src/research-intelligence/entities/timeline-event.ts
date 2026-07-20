/**
 * TimelineEvent Entity (Sprint 11)
 *
 * Represents a single event on a researcher's academic timeline.
 */

import { Entity, UniqueId, Result } from '@rios/shared';

import {
  TimelineEventId,
  TimelineDate,
  TimelineEventType,
  TimelineEventTypeValue,
} from '../value-objects/research-intelligence-value-objects.js';

export interface TimelineEventProps {
  id: TimelineEventId;
  profileId: string;
  title: string;
  description: string;
  eventType: TimelineEventType;
  eventDate: TimelineDate;
  endDate?: TimelineDate;
  relatedEntityId?: string;
  metadata?: Record<string, string>;
}

export class TimelineEvent extends Entity<TimelineEventProps> {
  private constructor(props: TimelineEventProps, id?: UniqueId) {
    super(props, id);
  }

  public override get id(): TimelineEventId {
    return this.props.id;
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get title(): string {
    return this.props.title;
  }

  public get description(): string {
    return this.props.description;
  }

  public get eventType(): TimelineEventType {
    return this.props.eventType;
  }

  public get eventDate(): TimelineDate {
    return this.props.eventDate;
  }

  public get endDate(): TimelineDate | undefined {
    return this.props.endDate;
  }

  public get relatedEntityId(): string | undefined {
    return this.props.relatedEntityId;
  }

  public get metadata(): Record<string, string> | undefined {
    return this.props.metadata;
  }

  public updateTitle(title: string): Result<void> {
    if (title.trim().length === 0) {
      return Result.fail<void>('Timeline event title cannot be empty');
    }
    if (title.length > 300) {
      return Result.fail<void>('Timeline event title cannot exceed 300 characters');
    }
    this.props.title = title.trim();
    return Result.ok<void>(undefined);
  }

  public updateDescription(description: string): void {
    this.props.description = description;
  }

  public updateEndDate(endDate: TimelineDate | undefined): Result<void> {
    if (endDate && endDate.value.getTime() < this.props.eventDate.value.getTime()) {
      return Result.fail<void>('End date cannot be before event date');
    }
    this.props.endDate = endDate;
    return Result.ok<void>(undefined);
  }

  public static create(props: {
    id: TimelineEventId;
    profileId: string;
    title: string;
    description: string;
    eventType: TimelineEventTypeValue;
    eventDate: Date;
    endDate?: Date;
    relatedEntityId?: string;
    metadata?: Record<string, string>;
  }): Result<TimelineEvent> {
    if (props.title.trim().length === 0) {
      return Result.fail<TimelineEvent>('Timeline event title cannot be empty');
    }
    if (props.title.length > 300) {
      return Result.fail<TimelineEvent>('Timeline event title cannot exceed 300 characters');
    }
    if (props.profileId.trim().length === 0) {
      return Result.fail<TimelineEvent>('Profile ID is required');
    }

    const eventTypeResult = TimelineEventType.create(props.eventType);
    if (eventTypeResult.isFailure) {
      return Result.fail<TimelineEvent>(eventTypeResult.error);
    }

    const eventDateResult = TimelineDate.create(props.eventDate);
    if (eventDateResult.isFailure) {
      return Result.fail<TimelineEvent>(eventDateResult.error);
    }

    let endDateVO: TimelineDate | undefined;
    if (props.endDate) {
      const endDateResult = TimelineDate.create(props.endDate);
      if (endDateResult.isFailure) {
        return Result.fail<TimelineEvent>(endDateResult.error);
      }
      endDateVO = endDateResult.value;
      if (endDateVO.value < eventDateResult.value.value) {
        return Result.fail<TimelineEvent>('End date cannot be before event date');
      }
    }

    return Result.ok<TimelineEvent>(
      new TimelineEvent({
        id: props.id,
        profileId: props.profileId.trim(),
        title: props.title.trim(),
        description: props.description,
        eventType: eventTypeResult.value,
        eventDate: eventDateResult.value,
        endDate: endDateVO,
        relatedEntityId: props.relatedEntityId,
        metadata: props.metadata,
      }),
    );
  }
}
