/**
 * DatasetVersion Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import {
  Checksum,
  FileSize,
  SemanticVersion,
} from '../value-objects/research-assets-value-objects.js';

export interface DatasetVersionProps {
  versionNumber: SemanticVersion;
  title: string;
  description?: string;
  fileUrl: string;
  fileSizeBytes: FileSize;
  checksum?: Checksum;
  releaseDate: Date;
  changelog?: string;
}

export class DatasetVersion extends Entity<DatasetVersionProps> {
  private constructor(props: DatasetVersionProps, id?: UniqueId) {
    super(props, id);
  }

  public get versionNumber(): SemanticVersion {
    return this.props.versionNumber;
  }
  public get title(): string {
    return this.props.title;
  }
  public get description(): string | undefined {
    return this.props.description;
  }
  public get fileUrl(): string {
    return this.props.fileUrl;
  }
  public get fileSizeBytes(): FileSize {
    return this.props.fileSizeBytes;
  }
  public get checksum(): Checksum | undefined {
    return this.props.checksum;
  }
  public get releaseDate(): Date {
    return this.props.releaseDate;
  }
  public get changelog(): string | undefined {
    return this.props.changelog;
  }

  public static create(
    props: {
      versionNumber: SemanticVersion;
      title: string;
      description?: string;
      fileUrl: string;
      fileSizeBytes: FileSize;
      checksum?: Checksum;
      releaseDate?: Date;
      changelog?: string;
    },
    id?: UniqueId,
  ): Result<DatasetVersion> {
    if (!props.title || !props.title.trim()) {
      return Result.fail<DatasetVersion>('DatasetVersion title is required.');
    }
    if (!props.fileUrl || !props.fileUrl.trim()) {
      return Result.fail<DatasetVersion>('DatasetVersion file URL is required.');
    }

    return Result.ok<DatasetVersion>(
      new DatasetVersion(
        {
          ...props,
          releaseDate: props.releaseDate ?? new Date(),
        },
        id,
      ),
    );
  }
}
