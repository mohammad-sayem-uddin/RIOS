/**
 * SupplementaryFile & ExternalResource Entities
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { FileSize, MediaType } from '../value-objects/research-assets-value-objects.js';

export interface SupplementaryFileProps {
  publicationId?: string;
  filename: string;
  fileUrl: string;
  fileSizeBytes: FileSize;
  mimeType: MediaType;
  description?: string;
}

export class SupplementaryFile extends Entity<SupplementaryFileProps> {
  private constructor(props: SupplementaryFileProps, id?: UniqueId) {
    super(props, id);
  }

  public get publicationId(): string | undefined {
    return this.props.publicationId;
  }
  public get filename(): string {
    return this.props.filename;
  }
  public get fileUrl(): string {
    return this.props.fileUrl;
  }
  public get fileSizeBytes(): FileSize {
    return this.props.fileSizeBytes;
  }
  public get mimeType(): MediaType {
    return this.props.mimeType;
  }
  public get description(): string | undefined {
    return this.props.description;
  }

  public static create(props: SupplementaryFileProps, id?: UniqueId): Result<SupplementaryFile> {
    if (!props.filename || !props.filename.trim()) {
      return Result.fail<SupplementaryFile>('Filename is required.');
    }
    if (!props.fileUrl || !props.fileUrl.trim()) {
      return Result.fail<SupplementaryFile>('File URL is required.');
    }
    return Result.ok<SupplementaryFile>(new SupplementaryFile(props, id));
  }
}

export interface ExternalResourceProps {
  title: string;
  url: string;
  provider: string; // e.g. Zenodo, Figshare, OSF, HuggingFace, Kaggle
  description?: string;
}

export class ExternalResource extends Entity<ExternalResourceProps> {
  private constructor(props: ExternalResourceProps, id?: UniqueId) {
    super(props, id);
  }

  public get title(): string {
    return this.props.title;
  }
  public get url(): string {
    return this.props.url;
  }
  public get provider(): string {
    return this.props.provider;
  }
  public get description(): string | undefined {
    return this.props.description;
  }

  public static create(props: ExternalResourceProps, id?: UniqueId): Result<ExternalResource> {
    if (!props.title || !props.title.trim()) {
      return Result.fail<ExternalResource>('External resource title is required.');
    }
    if (!props.url || !props.url.trim()) {
      return Result.fail<ExternalResource>('External resource URL is required.');
    }
    return Result.ok<ExternalResource>(new ExternalResource(props, id));
  }
}
