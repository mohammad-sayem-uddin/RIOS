/**
 * Software Release Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { GitCommitHash, SemanticVersion } from '../value-objects/research-assets-value-objects.js';

export interface ReleaseProps {
  version: SemanticVersion;
  title: string;
  tagName: string;
  targetCommitish?: GitCommitHash;
  description?: string;
  isPrerelease: boolean;
  releasedAt: Date;
  downloadUrl?: string;
}

export class Release extends Entity<ReleaseProps> {
  private constructor(props: ReleaseProps, id?: UniqueId) {
    super(props, id);
  }

  public get version(): SemanticVersion {
    return this.props.version;
  }
  public get title(): string {
    return this.props.title;
  }
  public get tagName(): string {
    return this.props.tagName;
  }
  public get targetCommitish(): GitCommitHash | undefined {
    return this.props.targetCommitish;
  }
  public get description(): string | undefined {
    return this.props.description;
  }
  public get isPrerelease(): boolean {
    return this.props.isPrerelease;
  }
  public get releasedAt(): Date {
    return this.props.releasedAt;
  }
  public get downloadUrl(): string | undefined {
    return this.props.downloadUrl;
  }

  public static create(
    props: {
      version: SemanticVersion;
      title: string;
      tagName: string;
      targetCommitish?: GitCommitHash;
      description?: string;
      isPrerelease?: boolean;
      releasedAt?: Date;
      downloadUrl?: string;
    },
    id?: UniqueId,
  ): Result<Release> {
    if (!props.title || !props.title.trim()) {
      return Result.fail<Release>('Release title is required.');
    }
    if (!props.tagName || !props.tagName.trim()) {
      return Result.fail<Release>('Release tag name is required.');
    }

    return Result.ok<Release>(
      new Release(
        {
          ...props,
          isPrerelease: props.isPrerelease ?? false,
          releasedAt: props.releasedAt ?? new Date(),
        },
        id,
      ),
    );
  }
}
