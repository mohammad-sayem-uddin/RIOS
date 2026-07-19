/**
 * Research Assets Application Service Interface
 */

import { Result } from '@rios/shared';

import type {
  CreateDatasetDto,
  CreateExperimentDto,
  CreateRepositoryDto,
  CreateSoftwareArtifactDto,
  ExperimentOutputDto,
  LinkRepositoryDto,
  PublishDatasetDto,
  ReleaseSoftwareDto,
  RepositoryOutputDto,
  ResearchAssetOutputDto,
  ResearchDatasetOutputDto,
  SoftwareArtifactOutputDto,
  UploadResearchAssetDto,
} from '../dtos/research-assets-dtos.js';

export interface ResearchAssetsApplicationService {
  createDataset(dto: CreateDatasetDto): Promise<Result<ResearchDatasetOutputDto>>;
  publishDataset(dto: PublishDatasetDto): Promise<Result<ResearchDatasetOutputDto>>;
  getDatasetById(id: string): Promise<Result<ResearchDatasetOutputDto>>;
  searchDatasets(query: string, profileId?: string): Promise<Result<ResearchDatasetOutputDto[]>>;
  deleteDataset(id: string): Promise<Result<void>>;

  createRepository(dto: CreateRepositoryDto): Promise<Result<RepositoryOutputDto>>;
  getRepositoryById(id: string): Promise<Result<RepositoryOutputDto>>;
  searchRepositories(query: string): Promise<Result<RepositoryOutputDto[]>>;

  createSoftwareArtifact(
    dto: CreateSoftwareArtifactDto,
  ): Promise<Result<SoftwareArtifactOutputDto>>;
  linkRepository(dto: LinkRepositoryDto): Promise<Result<SoftwareArtifactOutputDto>>;
  releaseSoftware(dto: ReleaseSoftwareDto): Promise<Result<SoftwareArtifactOutputDto>>;
  getSoftwareArtifactById(id: string): Promise<Result<SoftwareArtifactOutputDto>>;
  getSoftwareByProfileId(profileId: string): Promise<Result<SoftwareArtifactOutputDto[]>>;

  createExperiment(dto: CreateExperimentDto): Promise<Result<ExperimentOutputDto>>;
  getExperimentById(id: string): Promise<Result<ExperimentOutputDto>>;
  getExperimentsByProfileId(profileId: string): Promise<Result<ExperimentOutputDto[]>>;

  uploadResearchAsset(dto: UploadResearchAssetDto): Promise<Result<ResearchAssetOutputDto>>;
  getResearchAssetById(id: string): Promise<Result<ResearchAssetOutputDto>>;
  getResearchAssets(filters?: {
    profileId?: string;
    publicationId?: string;
    category?: string;
  }): Promise<Result<ResearchAssetOutputDto[]>>;
  deleteResearchAsset(id: string): Promise<Result<void>>;
}
