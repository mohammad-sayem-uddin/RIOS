/**
 * SoftwareArtifact Aggregate Root
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { Release } from '../entities/release.js';
import { Repository } from '../entities/repository.js';
import {
  DuplicateGitRepositoryError,
  MissingLicenseForPublicAssetError,
  ReleaseRequiresRepositoryError,
} from '../errors/research-assets-errors.js';
import {
  ModelReleasedEvent,
  RepositoryLinkedEvent,
  RepositoryUnlinkedEvent,
} from '../events/research-assets-events.js';
import {
  AssetVisibility,
  Framework,
  License,
  ProgrammingLanguage,
  SoftwareArtifactId,
} from '../value-objects/research-assets-value-objects.js';

export interface SoftwareArtifactProps {
  profileId: UniqueId;
  name: string;
  description: string;
  programmingLanguages: ProgrammingLanguage[];
  frameworks: Framework[];
  license?: License;
  visibility: AssetVisibility;
  repositories: Repository[];
  releases: Release[];
  createdAt: Date;
  updatedAt: Date;
}

export class SoftwareArtifact extends AggregateRoot<SoftwareArtifactProps> {
  private constructor(props: SoftwareArtifactProps, id: UniqueId) {
    super(props, id);
  }

  public get artifactId(): SoftwareArtifactId {
    return SoftwareArtifactId.fromUniqueId(this._id);
  }

  public get profileId(): UniqueId {
    return this.props.profileId;
  }
  public get name(): string {
    return this.props.name;
  }
  public get description(): string {
    return this.props.description;
  }
  public get programmingLanguages(): ProgrammingLanguage[] {
    return [...this.props.programmingLanguages];
  }
  public get frameworks(): Framework[] {
    return [...this.props.frameworks];
  }
  public get license(): License | undefined {
    return this.props.license;
  }
  public get visibility(): AssetVisibility {
    return this.props.visibility;
  }
  public get repositories(): Repository[] {
    return [...this.props.repositories];
  }
  public get releases(): Release[] {
    return [...this.props.releases];
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
      name: string;
      description?: string;
      programmingLanguages?: ProgrammingLanguage[];
      frameworks?: Framework[];
      license?: License;
      visibility?: AssetVisibility;
      repositories?: Repository[];
      releases?: Release[];
    },
    id?: UniqueId,
  ): Result<SoftwareArtifact> {
    const artifactId = id ?? UniqueId.create();
    const nameTrimmed = props.name?.trim();
    if (!nameTrimmed) {
      return Result.fail<SoftwareArtifact>('Software artifact name is required.');
    }

    const visibility = props.visibility ?? AssetVisibility.PUBLIC;
    if (visibility === AssetVisibility.PUBLIC && !props.license) {
      return Result.fail<SoftwareArtifact>(new MissingLicenseForPublicAssetError().message);
    }

    const artifact = new SoftwareArtifact(
      {
        profileId: props.profileId,
        name: nameTrimmed,
        description: props.description?.trim() ?? '',
        programmingLanguages: props.programmingLanguages ?? [],
        frameworks: props.frameworks ?? [],
        license: props.license,
        visibility,
        repositories: props.repositories ?? [],
        releases: props.releases ?? [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      artifactId,
    );

    return Result.ok<SoftwareArtifact>(artifact);
  }

  public linkRepository(repository: Repository): Result<void> {
    const exists = this.props.repositories.some(
      (r) => r.id.equals(repository.id) || r.url.value === repository.url.value,
    );
    if (exists) {
      return Result.fail<void>(new DuplicateGitRepositoryError(repository.id.value).message);
    }

    this.props.repositories.push(repository);
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new RepositoryLinkedEvent(repository.id.value, repository.url.value, this.artifactId.value),
    );

    return Result.ok();
  }

  public unlinkRepository(repositoryId: string): Result<void> {
    const initialLen = this.props.repositories.length;
    this.props.repositories = this.props.repositories.filter((r) => r.id.value !== repositoryId);

    if (this.props.repositories.length < initialLen) {
      this.props.updatedAt = new Date();
      this.addDomainEvent(new RepositoryUnlinkedEvent(repositoryId, this.artifactId.value));
    }

    return Result.ok();
  }

  public addRelease(release: Release): Result<void> {
    if (this.props.repositories.length === 0) {
      return Result.fail<void>(new ReleaseRequiresRepositoryError().message);
    }

    this.props.releases.push(release);
    this.props.updatedAt = new Date();

    this.addDomainEvent(new ModelReleasedEvent(release.id.value, this.name, release.version.value));

    return Result.ok();
  }
}
