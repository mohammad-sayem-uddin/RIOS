/**
 * TimelineEvent Entity (Sprint 11)
 *
 * Represents a single event on a researcher's academic timeline.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import {
  TimelineDate,
  TimelineEventType,
} from '../value-objects/research-intelligence-value-objects.js';

export interface TimelineEventProps {
  title: string;
  description?: string;
  eventType: TimelineEventType;
  eventDate: TimelineDate;
  metadataJson?: string;
  profileId?: string;
}

export class TimelineEvent extends Entity<TimelineEventProps> {
  private constructor(props: TimelineEventProps, id?: UniqueId) {
    super(props, id);
  }

  public get title(): string {
    return this.props.title;
  }

  public get description(): string | undefined {
    return this.props.description;
  }

  public get eventType(): TimelineEventType {
    return this.props.eventType;
  }

  public get eventDate(): TimelineDate {
    return this.props.eventDate;
  }

  public get metadataJson(): string | undefined {
    return this.props.metadataJson;
  }

  public get profileId(): string | undefined {
    return this.props.profileId;
  }

  public static create(
    props: {
      eventType: TimelineEventType;
      title: string;
      description?: string;
      eventDate: Date;
      metadataJson?: string;
      profileId?: string;
    },
    id?: UniqueId,
  ): Result<TimelineEvent> {
    if (props.title.trim().length === 0) {
      return Result.fail<TimelineEvent>('Timeline event title cannot be empty');
    }
    if (props.title.length > 300) {
      return Result.fail<TimelineEvent>('Timeline event title cannot exceed 300 characters');
    }

    const eventDateResult = TimelineDate.create(props.eventDate);
    if (eventDateResult.isFailure) {
      return Result.fail<TimelineEvent>(eventDateResult.error);
    }

    return Result.ok<TimelineEvent>(
      new TimelineEvent(
        {
          title: props.title.trim(),
          description: props.description,
          eventType: props.eventType,
          eventDate: eventDateResult.value,
          metadataJson: props.metadataJson,
          profileId: props.profileId,
        },
        id,
      ),
    );
  }
}
