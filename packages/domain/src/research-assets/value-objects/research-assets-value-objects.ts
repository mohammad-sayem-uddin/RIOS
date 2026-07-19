/**
 * Research Assets Bounded Context Value Objects
 *
 * Immutable domain primitives for datasets, software artifacts, repositories,
 * experiments, models, and scholarly assets.
 */

import { Result, UniqueId, ValueObject } from '@rios/shared';

import {
  ResearchArea,
  ResearchField,
} from '../../publications/value-objects/publication-value-objects.js';

export { ResearchArea, ResearchField };

export class DatasetId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): DatasetId {
    return new DatasetId(id ?? UniqueId.create().value);
  }

  public static from(id: string): DatasetId {
    return new DatasetId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): DatasetId {
    return new DatasetId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class AssetId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): AssetId {
    return new AssetId(id ?? UniqueId.create().value);
  }

  public static from(id: string): AssetId {
    return new AssetId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): AssetId {
    return new AssetId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class RepositoryId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): RepositoryId {
    return new RepositoryId(id ?? UniqueId.create().value);
  }

  public static from(id: string): RepositoryId {
    return new RepositoryId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): RepositoryId {
    return new RepositoryId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class SoftwareArtifactId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): SoftwareArtifactId {
    return new SoftwareArtifactId(id ?? UniqueId.create().value);
  }

  public static from(id: string): SoftwareArtifactId {
    return new SoftwareArtifactId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): SoftwareArtifactId {
    return new SoftwareArtifactId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class ExperimentId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): ExperimentId {
    return new ExperimentId(id ?? UniqueId.create().value);
  }

  public static from(id: string): ExperimentId {
    return new ExperimentId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): ExperimentId {
    return new ExperimentId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class Version extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(value: string): Result<Version> {
    const trimmed = value.trim();
    if (!trimmed) {
      return Result.fail<Version>('Version cannot be empty.');
    }
    return Result.ok<Version>(new Version(trimmed));
  }

  public static from(value: string): Version {
    return new Version(value.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class SemanticVersion extends ValueObject<{
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  raw: string;
}> {
  private constructor(props: {
    major: number;
    minor: number;
    patch: number;
    prerelease?: string;
    raw: string;
  }) {
    super(props);
  }

  public get major(): number {
    return this.props.major;
  }
  public get minor(): number {
    return this.props.minor;
  }
  public get patch(): number {
    return this.props.patch;
  }
  public get prerelease(): string | undefined {
    return this.props.prerelease;
  }
  public get value(): string {
    return this.props.raw;
  }

  public static create(versionStr: string): Result<SemanticVersion> {
    const trimmed = versionStr.trim().replace(/^v/, '');
    const semverRegex =
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

    const match = trimmed.match(semverRegex);
    if (!match) {
      return Result.fail<SemanticVersion>(`Invalid semantic version format: ${versionStr}`);
    }

    const major = parseInt(match[1] ?? '0', 10);
    const minor = parseInt(match[2] ?? '0', 10);
    const patch = parseInt(match[3] ?? '0', 10);
    const prerelease = match[4];

    return Result.ok<SemanticVersion>(
      new SemanticVersion({
        major,
        minor,
        patch,
        prerelease,
        raw: versionStr.trim(),
      }),
    );
  }

  public static from(versionStr: string): SemanticVersion {
    const res = SemanticVersion.create(versionStr);
    if (res.isFailure) {
      return new SemanticVersion({ major: 1, minor: 0, patch: 0, raw: versionStr });
    }
    return res.value;
  }

  public isGreaterThan(other: SemanticVersion): boolean {
    if (this.props.major !== other.props.major) return this.props.major > other.props.major;
    if (this.props.minor !== other.props.minor) return this.props.minor > other.props.minor;
    return this.props.patch > other.props.patch;
  }

  public override toString(): string {
    return this.props.raw;
  }
}

export class RepositoryURL extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(urlStr: string): Result<RepositoryURL> {
    const trimmed = urlStr.trim();
    if (!trimmed) {
      return Result.fail<RepositoryURL>('Repository URL cannot be empty.');
    }
    const repoRegex = /^(https?:\/\/|git@)([\w.-]+)[:/]([\w.-]+\/[\w.-]+?)(\.git)?$/;
    if (!repoRegex.test(trimmed)) {
      return Result.fail<RepositoryURL>(`Invalid repository URL format: ${urlStr}`);
    }
    return Result.ok<RepositoryURL>(new RepositoryURL(trimmed));
  }

  public static from(urlStr: string): RepositoryURL {
    return new RepositoryURL(urlStr.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class DatasetURL extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(urlStr: string): Result<DatasetURL> {
    const trimmed = urlStr.trim();
    if (!trimmed) {
      return Result.fail<DatasetURL>('Dataset URL cannot be empty.');
    }
    try {
      new URL(trimmed);
      return Result.ok<DatasetURL>(new DatasetURL(trimmed));
    } catch {
      return Result.fail<DatasetURL>(`Invalid dataset URL: ${urlStr}`);
    }
  }

  public static from(urlStr: string): DatasetURL {
    return new DatasetURL(urlStr.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class GitCommitHash extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(hash: string): Result<GitCommitHash> {
    const trimmed = hash.trim();
    const shaRegex = /^[0-9a-fA-F]{7,64}$/;
    if (!shaRegex.test(trimmed)) {
      return Result.fail<GitCommitHash>(`Invalid Git commit hash: ${hash}`);
    }
    return Result.ok<GitCommitHash>(new GitCommitHash(trimmed.toLowerCase()));
  }

  public static from(hash: string): GitCommitHash {
    return new GitCommitHash(hash.trim().toLowerCase());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class AssetDOI extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(doi: string): Result<AssetDOI> {
    const trimmed = doi.trim();
    if (!trimmed) {
      return Result.fail<AssetDOI>('DOI cannot be empty.');
    }
    const doiRegex = /^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/;
    if (!doiRegex.test(trimmed)) {
      return Result.fail<AssetDOI>(`Invalid DOI format: ${doi}`);
    }
    return Result.ok<AssetDOI>(new AssetDOI(trimmed.toLowerCase()));
  }

  public static from(doi: string): AssetDOI {
    return new AssetDOI(doi.trim().toLowerCase());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class License extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(licenseStr: string): Result<License> {
    const trimmed = licenseStr.trim();
    if (!trimmed) {
      return Result.fail<License>('License cannot be empty.');
    }
    return Result.ok<License>(new License(trimmed));
  }

  public static from(licenseStr: string): License {
    return new License(licenseStr.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class Checksum extends ValueObject<{ algorithm: string; hash: string }> {
  private constructor(algorithm: string, hash: string) {
    super({ algorithm, hash });
  }

  public get algorithm(): string {
    return this.props.algorithm;
  }
  public get hash(): string {
    return this.props.hash;
  }
  public get value(): string {
    return `${this.props.algorithm}:${this.props.hash}`;
  }

  public static create(algorithm: string, hash: string): Result<Checksum> {
    const algoTrimmed = algorithm.trim().toLowerCase();
    const hashTrimmed = hash.trim().toLowerCase();
    if (!algoTrimmed || !hashTrimmed) {
      return Result.fail<Checksum>('Checksum algorithm and hash cannot be empty.');
    }
    return Result.ok<Checksum>(new Checksum(algoTrimmed, hashTrimmed));
  }

  public static from(algorithm: string, hash: string): Checksum {
    return new Checksum(algorithm.trim().toLowerCase(), hash.trim().toLowerCase());
  }

  public override toString(): string {
    return this.value;
  }
}

export class ProgrammingLanguage extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<ProgrammingLanguage> {
    const trimmed = name.trim();
    if (!trimmed) {
      return Result.fail<ProgrammingLanguage>('Programming language cannot be empty.');
    }
    return Result.ok<ProgrammingLanguage>(new ProgrammingLanguage(trimmed));
  }

  public static from(name: string): ProgrammingLanguage {
    return new ProgrammingLanguage(name.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class Framework extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<Framework> {
    const trimmed = name.trim();
    if (!trimmed) {
      return Result.fail<Framework>('Framework cannot be empty.');
    }
    return Result.ok<Framework>(new Framework(trimmed));
  }

  public static from(name: string): Framework {
    return new Framework(name.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export enum StorageProviderType {
  ZENODO = 'ZENODO',
  FIGSHARE = 'FIGSHARE',
  DRYAD = 'DRYAD',
  HUGGING_FACE = 'HUGGING_FACE',
  KAGGLE = 'KAGGLE',
  GITHUB = 'GITHUB',
  GITLAB = 'GITLAB',
  AWS_S3 = 'AWS_S3',
  GOOGLE_DRIVE = 'GOOGLE_DRIVE',
  OSF = 'OSF',
  OTHER = 'OTHER',
}

export class StorageProvider extends ValueObject<{
  type: StorageProviderType;
  identifier?: string;
}> {
  private constructor(type: StorageProviderType, identifier?: string) {
    super({ type, identifier });
  }

  public get type(): StorageProviderType {
    return this.props.type;
  }
  public get identifier(): string | undefined {
    return this.props.identifier;
  }

  public static create(type: StorageProviderType, identifier?: string): StorageProvider {
    return new StorageProvider(type, identifier);
  }

  public override toString(): string {
    return this.props.identifier !== undefined && this.props.identifier !== ''
      ? `${this.props.type}:${this.props.identifier}`
      : this.props.type;
  }
}

export class FileSize extends ValueObject<{ bytes: number }> {
  private constructor(bytes: number) {
    super({ bytes });
  }

  public get bytes(): number {
    return this.props.bytes;
  }

  public static create(bytes: number): Result<FileSize> {
    if (bytes < 0) {
      return Result.fail<FileSize>('File size cannot be negative.');
    }
    return Result.ok<FileSize>(new FileSize(bytes));
  }

  public static from(bytes: number): FileSize {
    return new FileSize(Math.max(0, bytes));
  }

  public toHumanReadable(): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = this.props.bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  public override toString(): string {
    return `${this.props.bytes} B`;
  }
}

export class MediaType extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(mimeType: string): Result<MediaType> {
    const trimmed = mimeType.trim();
    if (!trimmed || !trimmed.includes('/')) {
      return Result.fail<MediaType>(`Invalid MIME type: ${mimeType}`);
    }
    return Result.ok<MediaType>(new MediaType(trimmed.toLowerCase()));
  }

  public static from(mimeType: string): MediaType {
    return new MediaType(mimeType.trim().toLowerCase());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export enum AssetVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  INTERNAL = 'INTERNAL',
  RESTRICTED = 'RESTRICTED',
}

export enum AssetAccessLevel {
  OPEN = 'OPEN',
  EMBARGOED = 'EMBARGOED',
  RESTRICTED = 'RESTRICTED',
  CLOSED = 'CLOSED',
}

export enum ResearchAssetCategory {
  DATASET = 'DATASET',
  SOFTWARE = 'SOFTWARE',
  MODEL = 'MODEL',
  EXPERIMENT = 'EXPERIMENT',
  PRESENTATION = 'PRESENTATION',
  POSTER = 'POSTER',
  DEMO = 'DEMO',
  VIDEO = 'VIDEO',
  DOCUMENTATION = 'DOCUMENTATION',
  SUPPLEMENTARY = 'SUPPLEMENTARY',
  EXTERNAL = 'EXTERNAL',
}
