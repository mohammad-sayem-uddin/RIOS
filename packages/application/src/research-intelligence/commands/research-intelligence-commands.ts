/**
 * CQRS Commands for Research Intelligence (Sprint 11)
 */

import { Command } from '@rios/shared';

import type {
  CalculateResearchMetricsDto,
  CreateCollaborationDto,
  CreateTimelineEventDto,
  UpdateTimelineDto,
} from '../dtos/research-intelligence-dtos.js';

export class CreateTimelineEventCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly data: CreateTimelineEventDto;

  constructor(data: CreateTimelineEventDto, commandId = '', timestamp = new Date()) {
    this.commandId = commandId;
    this.timestamp = timestamp;
    this.data = data;
    Object.freeze(this);
  }
}

export class UpdateTimelineCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly data: UpdateTimelineDto;

  constructor(data: UpdateTimelineDto, commandId = '', timestamp = new Date()) {
    this.commandId = commandId;
    this.timestamp = timestamp;
    this.data = data;
    Object.freeze(this);
  }
}

export class CreateCollaborationCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly data: CreateCollaborationDto;

  constructor(data: CreateCollaborationDto, commandId = '', timestamp = new Date()) {
    this.commandId = commandId;
    this.timestamp = timestamp;
    this.data = data;
    Object.freeze(this);
  }
}

export class RemoveCollaborationCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly profileId: string;
  public readonly collaborationId: string;

  constructor(profileId: string, collaborationId: string, commandId = '', timestamp = new Date()) {
    this.commandId = commandId;
    this.timestamp = timestamp;
    this.profileId = profileId;
    this.collaborationId = collaborationId;
    Object.freeze(this);
  }
}

export class CalculateResearchMetricsCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly data: CalculateResearchMetricsDto;

  constructor(data: CalculateResearchMetricsDto, commandId = '', timestamp = new Date()) {
    this.commandId = commandId;
    this.timestamp = timestamp;
    this.data = data;
    Object.freeze(this);
  }
}
