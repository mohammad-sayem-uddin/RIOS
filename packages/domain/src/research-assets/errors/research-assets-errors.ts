/**
 * Research Assets Domain Errors
 */

import { DomainError } from '@rios/shared';

export class DuplicateDoiError extends DomainError {
  constructor(doi: string) {
    super(`DOI '${doi}' already exists in the system.`, 'DUPLICATE_DOI');
    this.name = 'DuplicateDoiError';
  }
}

export class DuplicateRepositoryUrlError extends DomainError {
  constructor(url: string) {
    super(`Repository URL '${url}' is already registered.`, 'DUPLICATE_REPOSITORY_URL');
    this.name = 'DuplicateRepositoryUrlError';
  }
}

export class DuplicateGitRepositoryError extends DomainError {
  constructor(repositoryId: string) {
    super(`Git Repository '${repositoryId}' is already linked.`, 'DUPLICATE_GIT_REPOSITORY');
    this.name = 'DuplicateGitRepositoryError';
  }
}

export class InvalidSemanticVersionError extends DomainError {
  constructor(version: string) {
    super(`Invalid semantic version string: '${version}'.`, 'INVALID_SEMANTIC_VERSION');
    this.name = 'InvalidSemanticVersionError';
  }
}

export class InvalidVersionSequenceError extends DomainError {
  constructor(currentVersion: string, newVersion: string) {
    super(
      `New version '${newVersion}' must be strictly greater than current version '${currentVersion}'.`,
      'INVALID_VERSION_SEQUENCE',
    );
    this.name = 'InvalidVersionSequenceError';
  }
}

export class DuplicateChecksumError extends DomainError {
  constructor(checksum: string) {
    super(
      `File checksum '${checksum}' already exists within the same dataset version.`,
      'DUPLICATE_CHECKSUM',
    );
    this.name = 'DuplicateChecksumError';
  }
}

export class ReleaseRequiresRepositoryError extends DomainError {
  constructor() {
    super(
      'A software release requires a valid code repository link.',
      'RELEASE_REQUIRES_REPOSITORY',
    );
    this.name = 'ReleaseRequiresRepositoryError';
  }
}

export class MissingLicenseForPublicAssetError extends DomainError {
  constructor() {
    super(
      'Publicly accessible assets must specify a valid license.',
      'MISSING_LICENSE_FOR_PUBLIC_ASSET',
    );
    this.name = 'MissingLicenseForPublicAssetError';
  }
}

export class DatasetNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Research dataset with ID '${id}' was not found.`, 'DATASET_NOT_FOUND');
    this.name = 'DatasetNotFoundError';
  }
}

export class SoftwareArtifactNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Software artifact with ID '${id}' was not found.`, 'SOFTWARE_ARTIFACT_NOT_FOUND');
    this.name = 'SoftwareArtifactNotFoundError';
  }
}

export class ResearchAssetNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Research asset with ID '${id}' was not found.`, 'RESEARCH_ASSET_NOT_FOUND');
    this.name = 'ResearchAssetNotFoundError';
  }
}

export class ExperimentNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Experiment with ID '${id}' was not found.`, 'EXPERIMENT_NOT_FOUND');
    this.name = 'ExperimentNotFoundError';
  }
}

export class RepositoryNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Repository with ID '${id}' was not found.`, 'REPOSITORY_NOT_FOUND');
    this.name = 'RepositoryNotFoundError';
  }
}
