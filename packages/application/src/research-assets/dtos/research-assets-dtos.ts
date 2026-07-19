/**
 * Research Assets DTOs
 */

export interface DatasetVersionInputDto {
  versionNumber: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileSizeBytes: number;
  checksumAlgorithm?: string;
  checksumHash?: string;
  changelog?: string;
}

export interface DatasetVersionOutputDto {
  id: string;
  versionNumber: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileSizeBytes: number;
  releaseDate: string;
  changelog?: string;
}

export interface CreateDatasetDto {
  profileId: string;
  title: string;
  description: string;
  doi?: string;
  license?: string;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'INTERNAL' | 'RESTRICTED';
  accessLevel?: 'OPEN' | 'EMBARGOED' | 'RESTRICTED' | 'CLOSED';
  storageProviderType?: string;
  storageProviderIdentifier?: string;
  datasetUrl?: string;
  field?: string;
  area?: string;
  initialVersion?: DatasetVersionInputDto;
}

export interface PublishDatasetDto {
  datasetId: string;
  doi: string;
}

export interface ResearchDatasetOutputDto {
  id: string;
  profileId: string;
  title: string;
  description: string;
  doi?: string;
  license?: string;
  visibility: string;
  accessLevel: string;
  storageProvider?: string;
  datasetUrl?: string;
  field?: string;
  area?: string;
  versions: DatasetVersionOutputDto[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRepositoryDto {
  name: string;
  url: string;
  provider?: string;
  isPrivate?: boolean;
  defaultBranch?: string;
  primaryLanguage?: string;
  description?: string;
}

export interface RepositoryOutputDto {
  id: string;
  name: string;
  url: string;
  provider: string;
  isPrivate: boolean;
  defaultBranch: string;
  primaryLanguage?: string;
  starsCount: number;
  forksCount: number;
  openIssuesCount: number;
  description?: string;
}

export interface CreateSoftwareArtifactDto {
  profileId: string;
  name: string;
  description?: string;
  programmingLanguages?: string[];
  frameworks?: string[];
  license?: string;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'INTERNAL' | 'RESTRICTED';
  repositoryId?: string;
}

export interface LinkRepositoryDto {
  softwareArtifactId: string;
  repositoryId: string;
}

export interface ReleaseSoftwareDto {
  softwareArtifactId: string;
  version: string;
  title: string;
  tagName: string;
  targetCommitish?: string;
  description?: string;
  isPrerelease?: boolean;
  downloadUrl?: string;
}

export interface ReleaseOutputDto {
  id: string;
  version: string;
  title: string;
  tagName: string;
  targetCommitish?: string;
  description?: string;
  isPrerelease: boolean;
  releasedAt: string;
  downloadUrl?: string;
}

export interface SoftwareArtifactOutputDto {
  id: string;
  profileId: string;
  name: string;
  description: string;
  programmingLanguages: string[];
  frameworks: string[];
  license?: string;
  visibility: string;
  repositories: RepositoryOutputDto[];
  releases: ReleaseOutputDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateExperimentDto {
  title: string;
  description?: string;
  projectId?: string;
  profileId?: string;
  parametersJson?: string;
  metricsJson?: string;
  status?: string;
}

export interface ExperimentOutputDto {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  profileId?: string;
  parametersJson?: string;
  metricsJson?: string;
  status: string;
  executedAt?: string;
}

export interface UploadResearchAssetDto {
  profileId: string;
  publicationId?: string;
  projectId?: string;
  title: string;
  description?: string;
  category: string; // e.g. DATASET, SOFTWARE, MODEL, PRESENTATION, POSTER, DEMO, VIDEO, DOCUMENTATION, SUPPLEMENTARY, EXTERNAL
  fileUrl?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  license?: string;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'INTERNAL' | 'RESTRICTED';
  accessLevel?: 'OPEN' | 'EMBARGOED' | 'RESTRICTED' | 'CLOSED';
}

export interface ResearchAssetOutputDto {
  id: string;
  profileId: string;
  publicationId?: string;
  projectId?: string;
  title: string;
  description?: string;
  category: string;
  fileUrl?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  license?: string;
  visibility: string;
  accessLevel: string;
  createdAt: string;
  updatedAt: string;
}
