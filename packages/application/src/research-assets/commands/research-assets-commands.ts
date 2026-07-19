/**
 * Research Assets CQRS Commands
 */

import { Command } from '@rios/shared';

import type {
  CreateDatasetDto,
  CreateExperimentDto,
  CreateRepositoryDto,
  CreateSoftwareArtifactDto,
  LinkRepositoryDto,
  PublishDatasetDto,
  ReleaseSoftwareDto,
  UploadResearchAssetDto,
} from '../dtos/research-assets-dtos.js';

export class CreateDatasetCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly dto: CreateDatasetDto,
    commandId?: string,
    timestamp?: Date,
  ) {
    this.commandId = commandId ?? crypto.randomUUID();
    this.timestamp = timestamp ?? new Date();
    Object.freeze(this);
  }
}

export class PublishDatasetCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly dto: PublishDatasetDto,
    commandId?: string,
    timestamp?: Date,
  ) {
    this.commandId = commandId ?? crypto.randomUUID();
    this.timestamp = timestamp ?? new Date();
    Object.freeze(this);
  }
}

export class CreateRepositoryCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly dto: CreateRepositoryDto,
    commandId?: string,
    timestamp?: Date,
  ) {
    this.commandId = commandId ?? crypto.randomUUID();
    this.timestamp = timestamp ?? new Date();
    Object.freeze(this);
  }
}

export class CreateSoftwareArtifactCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly dto: CreateSoftwareArtifactDto,
    commandId?: string,
    timestamp?: Date,
  ) {
    this.commandId = commandId ?? crypto.randomUUID();
    this.timestamp = timestamp ?? new Date();
    Object.freeze(this);
  }
}

export class LinkRepositoryCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly dto: LinkRepositoryDto,
    commandId?: string,
    timestamp?: Date,
  ) {
    this.commandId = commandId ?? crypto.randomUUID();
    this.timestamp = timestamp ?? new Date();
    Object.freeze(this);
  }
}

export class ReleaseSoftwareCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly dto: ReleaseSoftwareDto,
    commandId?: string,
    timestamp?: Date,
  ) {
    this.commandId = commandId ?? crypto.randomUUID();
    this.timestamp = timestamp ?? new Date();
    Object.freeze(this);
  }
}

export class CreateExperimentCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly dto: CreateExperimentDto,
    commandId?: string,
    timestamp?: Date,
  ) {
    this.commandId = commandId ?? crypto.randomUUID();
    this.timestamp = timestamp ?? new Date();
    Object.freeze(this);
  }
}

export class UploadResearchAssetCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly dto: UploadResearchAssetDto,
    commandId?: string,
    timestamp?: Date,
  ) {
    this.commandId = commandId ?? crypto.randomUUID();
    this.timestamp = timestamp ?? new Date();
    Object.freeze(this);
  }
}

export class DeleteResearchAssetCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly assetId: string,
    commandId?: string,
    timestamp?: Date,
  ) {
    this.commandId = commandId ?? crypto.randomUUID();
    this.timestamp = timestamp ?? new Date();
    Object.freeze(this);
  }
}
