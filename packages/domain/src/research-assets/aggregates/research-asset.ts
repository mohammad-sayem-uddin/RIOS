/**
 * ResearchAsset Aggregate Root
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { Benchmark } from '../entities/benchmark.js';
import { ModelArtifact } from '../entities/model-artifact.js';
import { ExternalResource, SupplementaryFile } from '../entities/supplementary-file.js';
import { MissingLicenseForPublicAssetError } from '../errors/research-assets-errors.js';
import {
  ResearchAssetDeletedEvent,
  ResearchAssetUploadedEvent,
} from '../events/research-assets-events.js';
import {
  AssetAccessLevel,
  AssetId,
  AssetVisibility,
  FileSize,
  License,
  MediaType,
  ResearchAssetCategory,
} from '../value-objects/research-assets-value-objects.js';

export interface ResearchAssetProps {
  profileId: UniqueId;
  publicationId?: UniqueId;
  projectId?: UniqueId;
  title: string;
  description?: string;
  category: ResearchAssetCategory;
  fileUrl?: string;
  mimeType?: MediaType;
  fileSizeBytes?: FileSize;
  license?: License;
  visibility: AssetVisibility;
  accessLevel: AssetAccessLevel;
  supplementaryFiles: SupplementaryFile[];
  externalResources: ExternalResource[];
  models: ModelArtifact[];
  benchmarks: Benchmark[];
  createdAt: Date;
  updatedAt: Date;
}

export class ResearchAsset extends AggregateRoot<ResearchAssetProps> {
  private constructor(props: ResearchAssetProps, id: UniqueId) {
    super(props, id);
  }

  public get assetId(): AssetId {
    return AssetId.fromUniqueId(this._id);
  }

  public get profileId(): UniqueId {
    return this.props.profileId;
  }
  public get publicationId(): UniqueId | undefined {
    return this.props.publicationId;
  }
  public get projectId(): UniqueId | undefined {
    return this.props.projectId;
  }
  public get title(): string {
    return this.props.title;
  }
  public get description(): string | undefined {
    return this.props.description;
  }
  public get category(): ResearchAssetCategory {
    return this.props.category;
  }
  public get fileUrl(): string | undefined {
    return this.props.fileUrl;
  }
  public get mimeType(): MediaType | undefined {
    return this.props.mimeType;
  }
  public get fileSizeBytes(): FileSize | undefined {
    return this.props.fileSizeBytes;
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
  public get supplementaryFiles(): SupplementaryFile[] {
    return [...this.props.supplementaryFiles];
  }
  public get externalResources(): ExternalResource[] {
    return [...this.props.externalResources];
  }
  public get models(): ModelArtifact[] {
    return [...this.props.models];
  }
  public get benchmarks(): Benchmark[] {
    return [...this.props.benchmarks];
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
      publicationId?: UniqueId;
      projectId?: UniqueId;
      title: string;
      description?: string;
      category: ResearchAssetCategory;
      fileUrl?: string;
      mimeType?: MediaType;
      fileSizeBytes?: FileSize;
      license?: License;
      visibility?: AssetVisibility;
      accessLevel?: AssetAccessLevel;
      supplementaryFiles?: SupplementaryFile[];
      externalResources?: ExternalResource[];
      models?: ModelArtifact[];
      benchmarks?: Benchmark[];
    },
    id?: UniqueId,
  ): Result<ResearchAsset> {
    const assetId = id ?? UniqueId.create();
    const titleTrimmed = props.title?.trim();
    if (!titleTrimmed) {
      return Result.fail<ResearchAsset>('Asset title is required.');
    }

    const visibility = props.visibility ?? AssetVisibility.PUBLIC;
    const accessLevel = props.accessLevel ?? AssetAccessLevel.OPEN;

    if (visibility === AssetVisibility.PUBLIC && !props.license) {
      return Result.fail<ResearchAsset>(new MissingLicenseForPublicAssetError().message);
    }

    const asset = new ResearchAsset(
      {
        profileId: props.profileId,
        publicationId: props.publicationId,
        projectId: props.projectId,
        title: titleTrimmed,
        description: props.description?.trim(),
        category: props.category,
        fileUrl: props.fileUrl,
        mimeType: props.mimeType,
        fileSizeBytes: props.fileSizeBytes,
        license: props.license,
        visibility,
        accessLevel,
        supplementaryFiles: props.supplementaryFiles ?? [],
        externalResources: props.externalResources ?? [],
        models: props.models ?? [],
        benchmarks: props.benchmarks ?? [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      assetId,
    );

    if (props.fileUrl !== undefined && props.fileUrl !== '') {
      asset.addDomainEvent(
        new ResearchAssetUploadedEvent(
          asset.assetId.value,
          asset.title,
          asset.category,
          props.fileUrl,
        ),
      );
    }

    return Result.ok<ResearchAsset>(asset);
  }

  public delete(): Result<void> {
    this.addDomainEvent(new ResearchAssetDeletedEvent(this.assetId.value, new Date()));
    return Result.ok();
  }
}
