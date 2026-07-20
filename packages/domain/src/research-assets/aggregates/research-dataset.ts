/**
 * ResearchDataset Aggregate Root
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { DatasetVersion } from '../entities/dataset-version.js';
import {
  InvalidVersionSequenceError,
  MissingLicenseForPublicAssetError,
} from '../errors/research-assets-errors.js';
import {
  DatasetCreatedEvent,
  DatasetPublishedEvent,
  DatasetVersionReleasedEvent,
} from '../events/research-assets-events.js';
import {
  AssetAccessLevel,
  AssetDOI,
  AssetVisibility,
  DatasetId,
  DatasetURL,
  License,
  ResearchArea,
  ResearchField,
  StorageProvider,
} from '../value-objects/research-assets-value-objects.js';

export interface ResearchDatasetProps {
  profileId: UniqueId;
  title: string;
  description: string;
  doi?: AssetDOI;
  license?: License;
  visibility: AssetVisibility;
  accessLevel: AssetAccessLevel;
  storageProvider?: StorageProvider;
  datasetUrl?: DatasetURL;
  field?: ResearchField;
  area?: ResearchArea;
  versions: DatasetVersion[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ResearchDataset extends AggregateRoot<ResearchDatasetProps> {
  private constructor(props: ResearchDatasetProps, id: UniqueId) {
    super(props, id);
  }

  public get datasetId(): DatasetId {
    return DatasetId.fromUniqueId(this._id);
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
  public get doi(): AssetDOI | undefined {
    return this.props.doi;
  }
  public get license(): License | undefined {
    return this.props.license;
  }
  public get visibility(): AssetVisibility {
    return this.props.visibility;
  }
  public get accessLevel(): AssetAccessLevel {
    return this.props.accessLevel;
  }
  public get storageProvider(): StorageProvider | undefined {
    return this.props.storageProvider;
  }
  public get datasetUrl(): DatasetURL | undefined {
    return this.props.datasetUrl;
  }
  public get field(): ResearchField | undefined {
    return this.props.field;
  }
  public get area(): ResearchArea | undefined {
    return this.props.area;
  }
  public get versions(): DatasetVersion[] {
    return [...this.props.versions];
  }
  public get isPublished(): boolean {
    return this.props.isPublished;
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
      doi?: AssetDOI;
      license?: License;
      visibility?: AssetVisibility;
      accessLevel?: AssetAccessLevel;
      storageProvider?: StorageProvider;
      datasetUrl?: DatasetURL;
      field?: ResearchField;
      area?: ResearchArea;
      versions?: DatasetVersion[];
      isPublished?: boolean;
    },
    id?: UniqueId,
  ): Result<ResearchDataset> {
    const datasetId = id ?? UniqueId.create();
    const titleTrimmed = props.title?.trim();
    if (!titleTrimmed) {
      return Result.fail<ResearchDataset>('Dataset title is required.');
    }

    const visibility = props.visibility ?? AssetVisibility.PUBLIC;
    const accessLevel = props.accessLevel ?? AssetAccessLevel.OPEN;

    // Business Rule: Public asset must have a license
    if (visibility === AssetVisibility.PUBLIC && !props.license) {
      return Result.fail<ResearchDataset>(new MissingLicenseForPublicAssetError().message);
    }

    const dataset = new ResearchDataset(
      {
        profileId: props.profileId,
        title: titleTrimmed,
        description: props.description?.trim() ?? '',
        doi: props.doi,
        license: props.license,
        visibility,
        accessLevel,
        storageProvider: props.storageProvider,
        datasetUrl: props.datasetUrl,
        field: props.field,
        area: props.area,
        versions: props.versions ?? [],
        isPublished: props.isPublished ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      datasetId,
    );

    dataset.addDomainEvent(
      new DatasetCreatedEvent(
        dataset.datasetId.value,
        props.profileId.value,
        dataset.title,
        props.doi?.value,
      ),
    );

    return Result.ok<ResearchDataset>(dataset);
  }

  public publish(doi: AssetDOI): Result<void> {
    this.props.doi = doi;
    this.props.isPublished = true;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new DatasetPublishedEvent(this.datasetId.value, doi.value, new Date()));

    return Result.ok();
  }

  public addVersion(newVersion: DatasetVersion): Result<void> {
    // Check version sequence invariant
    if (this.props.versions.length > 0) {
      const latest = this.props.versions[this.props.versions.length - 1];
      if (latest !== undefined && !newVersion.versionNumber.isGreaterThan(latest.versionNumber)) {
        return Result.fail<void>(
          new InvalidVersionSequenceError(
            latest.versionNumber.value,
            newVersion.versionNumber.value,
          ).message,
        );
      }
    }

    this.props.versions.push(newVersion);
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new DatasetVersionReleasedEvent(
        this.datasetId.value,
        newVersion.id.value,
        newVersion.versionNumber.value,
      ),
    );

    return Result.ok();
  }
}
