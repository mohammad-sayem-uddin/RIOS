/**
 * Implementation of ResearchAssetsApplicationService
 */

import {
  AssetAccessLevel,
  AssetDOI,
  AssetVisibility,
  Checksum,
  DatasetURL,
  DatasetVersion,
  Experiment,
  FileSize,
  GitCommitHash,
  IExperimentRepository,
  IRepositoryRepository,
  IResearchAssetRepository,
  IResearchDatasetRepository,
  ISoftwareArtifactRepository,
  License,
  MediaType,
  ProgrammingLanguage,
  Release,
  Repository,
  RepositoryURL,
  ResearchArea,
  ResearchAsset,
  ResearchAssetCategory,
  ResearchDataset,
  ResearchField,
  SemanticVersion,
  SoftwareArtifact,
  StorageProvider,
  StorageProviderType,
} from '@rios/domain';
import { Result, UniqueId } from '@rios/shared';

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

import type { ResearchAssetsApplicationService } from './research-assets-application-service.js';

export class ResearchAssetsApplicationServiceImpl implements ResearchAssetsApplicationService {
  constructor(
    private readonly datasetRepo: IResearchDatasetRepository,
    private readonly softwareRepo: ISoftwareArtifactRepository,
    private readonly assetRepo: IResearchAssetRepository,
    private readonly experimentRepo: IExperimentRepository,
    private readonly repositoryRepo: IRepositoryRepository,
  ) {}

  public async createDataset(dto: CreateDatasetDto): Promise<Result<ResearchDatasetOutputDto>> {
    try {
      const profileId = UniqueId.from(dto.profileId);
      const doi =
        dto.doi !== undefined && dto.doi !== '' ? AssetDOI.create(dto.doi).value : undefined;
      const license =
        dto.license !== undefined && dto.license !== '' ? License.from(dto.license) : undefined;
      const datasetUrl =
        dto.datasetUrl !== undefined && dto.datasetUrl !== ''
          ? DatasetURL.from(dto.datasetUrl)
          : undefined;
      const field =
        dto.field !== undefined && dto.field !== '' ? ResearchField.from(dto.field) : undefined;
      const area =
        dto.area !== undefined && dto.area !== '' ? ResearchArea.from(dto.area) : undefined;
      const storageProvider =
        dto.storageProviderType !== undefined && dto.storageProviderType !== ''
          ? StorageProvider.create(
              (dto.storageProviderType as StorageProviderType) ?? StorageProviderType.OTHER,
              dto.storageProviderIdentifier,
            )
          : undefined;

      const initialVersions: DatasetVersion[] = [];
      if (dto.initialVersion) {
        const vRes = DatasetVersion.create({
          versionNumber: SemanticVersion.from(dto.initialVersion.versionNumber),
          title: dto.initialVersion.title,
          description: dto.initialVersion.description,
          fileUrl: dto.initialVersion.fileUrl,
          fileSizeBytes: FileSize.from(dto.initialVersion.fileSizeBytes),
          checksum:
            dto.initialVersion.checksumAlgorithm !== undefined &&
            dto.initialVersion.checksumAlgorithm !== '' &&
            dto.initialVersion.checksumHash !== undefined &&
            dto.initialVersion.checksumHash !== ''
              ? Checksum.from(dto.initialVersion.checksumAlgorithm, dto.initialVersion.checksumHash)
              : undefined,
          changelog: dto.initialVersion.changelog,
        });
        if (vRes.isFailure) return Result.fail(vRes.error);
        initialVersions.push(vRes.value);
      }

      const datasetRes = ResearchDataset.create({
        profileId,
        title: dto.title,
        description: dto.description,
        doi,
        license,
        visibility: dto.visibility as AssetVisibility,
        accessLevel: dto.accessLevel as AssetAccessLevel,
        storageProvider,
        datasetUrl,
        field,
        area,
        versions: initialVersions,
      });

      if (datasetRes.isFailure) return Result.fail(datasetRes.error);

      const dataset = datasetRes.value;
      await this.datasetRepo.save(dataset);

      return Result.ok(this.mapDatasetToDto(dataset));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err.message : String(err));
    }
  }

  public async publishDataset(dto: PublishDatasetDto): Promise<Result<ResearchDatasetOutputDto>> {
    try {
      const dataset = await this.datasetRepo.findById(dto.datasetId);
      if (!dataset) return Result.fail(`Dataset '${dto.datasetId}' not found.`);

      const doiRes = AssetDOI.create(dto.doi);
      if (doiRes.isFailure) return Result.fail(doiRes.error);

      const pubRes = dataset.publish(doiRes.value);
      if (pubRes.isFailure) return Result.fail(pubRes.error);

      await this.datasetRepo.save(dataset);
      return Result.ok(this.mapDatasetToDto(dataset));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err.message : String(err));
    }
  }

  public async getDatasetById(id: string): Promise<Result<ResearchDatasetOutputDto>> {
    const dataset = await this.datasetRepo.findById(id);
    if (!dataset) return Result.fail(`Dataset '${id}' not found.`);
    return Result.ok(this.mapDatasetToDto(dataset));
  }

  public async searchDatasets(
    query: string,
    profileId?: string,
  ): Promise<Result<ResearchDatasetOutputDto[]>> {
    let datasets: ResearchDataset[];
    if (profileId !== undefined && profileId !== '') {
      datasets = await this.datasetRepo.findByResearchProfile(profileId);
    } else {
      datasets = await this.datasetRepo.search(query);
    }
    return Result.ok(datasets.map((d) => this.mapDatasetToDto(d)));
  }

  public async deleteDataset(id: string): Promise<Result<void>> {
    await this.datasetRepo.delete(id);
    return Result.ok();
  }

  public async createRepository(dto: CreateRepositoryDto): Promise<Result<RepositoryOutputDto>> {
    try {
      const urlRes = RepositoryURL.create(dto.url);
      if (urlRes.isFailure) return Result.fail(urlRes.error);

      const repoRes = Repository.create({
        name: dto.name,
        url: urlRes.value,
        provider: dto.provider,
        isPrivate: dto.isPrivate,
        defaultBranch: dto.defaultBranch,
        primaryLanguage:
          dto.primaryLanguage !== undefined && dto.primaryLanguage !== ''
            ? ProgrammingLanguage.from(dto.primaryLanguage)
            : undefined,
        description: dto.description,
      });

      if (repoRes.isFailure) return Result.fail(repoRes.error);

      const repo = repoRes.value;
      await this.repositoryRepo.save(repo);

      return Result.ok(this.mapRepositoryToDto(repo));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err.message : String(err));
    }
  }

  public async getRepositoryById(id: string): Promise<Result<RepositoryOutputDto>> {
    const repo = await this.repositoryRepo.findById(id);
    if (!repo) return Result.fail(`Repository '${id}' not found.`);
    return Result.ok(this.mapRepositoryToDto(repo));
  }

  public async searchRepositories(query: string): Promise<Result<RepositoryOutputDto[]>> {
    const repos = await this.repositoryRepo.search(query);
    return Result.ok(repos.map((r) => this.mapRepositoryToDto(r)));
  }

  public async createSoftwareArtifact(
    dto: CreateSoftwareArtifactDto,
  ): Promise<Result<SoftwareArtifactOutputDto>> {
    try {
      const profileId = UniqueId.from(dto.profileId);
      const license =
        dto.license !== undefined && dto.license !== '' ? License.from(dto.license) : undefined;
      const langs = dto.programmingLanguages?.map((l) => ProgrammingLanguage.from(l));

      const artifactRes = SoftwareArtifact.create({
        profileId,
        name: dto.name,
        description: dto.description,
        programmingLanguages: langs,
        license,
        visibility: dto.visibility as AssetVisibility,
      });

      if (artifactRes.isFailure) return Result.fail(artifactRes.error);

      const artifact = artifactRes.value;

      if (dto.repositoryId !== undefined && dto.repositoryId !== '') {
        const repo = await this.repositoryRepo.findById(dto.repositoryId);
        if (repo) {
          artifact.linkRepository(repo);
        }
      }

      await this.softwareRepo.save(artifact);
      return Result.ok(this.mapSoftwareToDto(artifact));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err.message : String(err));
    }
  }

  public async linkRepository(dto: LinkRepositoryDto): Promise<Result<SoftwareArtifactOutputDto>> {
    try {
      const artifact = await this.softwareRepo.findById(dto.softwareArtifactId);
      if (!artifact) return Result.fail(`Software artifact '${dto.softwareArtifactId}' not found.`);

      const repo = await this.repositoryRepo.findById(dto.repositoryId);
      if (!repo) return Result.fail(`Repository '${dto.repositoryId}' not found.`);

      const linkRes = artifact.linkRepository(repo);
      if (linkRes.isFailure) return Result.fail(linkRes.error);

      await this.softwareRepo.save(artifact);
      return Result.ok(this.mapSoftwareToDto(artifact));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err.message : String(err));
    }
  }

  public async releaseSoftware(
    dto: ReleaseSoftwareDto,
  ): Promise<Result<SoftwareArtifactOutputDto>> {
    try {
      const artifact = await this.softwareRepo.findById(dto.softwareArtifactId);
      if (!artifact) return Result.fail(`Software artifact '${dto.softwareArtifactId}' not found.`);

      const releaseRes = Release.create({
        version: SemanticVersion.from(dto.version),
        title: dto.title,
        tagName: dto.tagName,
        targetCommitish:
          dto.targetCommitish !== undefined && dto.targetCommitish !== ''
            ? GitCommitHash.from(dto.targetCommitish)
            : undefined,
        description: dto.description,
        isPrerelease: dto.isPrerelease,
        downloadUrl: dto.downloadUrl,
      });

      if (releaseRes.isFailure) return Result.fail(releaseRes.error);

      const addRes = artifact.addRelease(releaseRes.value);
      if (addRes.isFailure) return Result.fail(addRes.error);

      await this.softwareRepo.save(artifact);
      return Result.ok(this.mapSoftwareToDto(artifact));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err.message : String(err));
    }
  }

  public async getSoftwareArtifactById(id: string): Promise<Result<SoftwareArtifactOutputDto>> {
    const artifact = await this.softwareRepo.findById(id);
    if (!artifact) return Result.fail(`Software artifact '${id}' not found.`);
    return Result.ok(this.mapSoftwareToDto(artifact));
  }

  public async getSoftwareByProfileId(
    profileId: string,
  ): Promise<Result<SoftwareArtifactOutputDto[]>> {
    const artifacts = await this.softwareRepo.findByResearchProfile(profileId);
    return Result.ok(artifacts.map((a) => this.mapSoftwareToDto(a)));
  }

  public async createExperiment(dto: CreateExperimentDto): Promise<Result<ExperimentOutputDto>> {
    try {
      const expRes = Experiment.create({
        title: dto.title,
        description: dto.description,
        projectId: dto.projectId,
        profileId: dto.profileId,
        parametersJson: dto.parametersJson,
        metricsJson: dto.metricsJson,
        status: dto.status,
      });

      if (expRes.isFailure) return Result.fail(expRes.error);

      const exp = expRes.value;
      await this.experimentRepo.save(exp);

      return Result.ok(this.mapExperimentToDto(exp));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err.message : String(err));
    }
  }

  public async getExperimentById(id: string): Promise<Result<ExperimentOutputDto>> {
    const exp = await this.experimentRepo.findById(id);
    if (!exp) return Result.fail(`Experiment '${id}' not found.`);
    return Result.ok(this.mapExperimentToDto(exp));
  }

  public async getExperimentsByProfileId(
    profileId: string,
  ): Promise<Result<ExperimentOutputDto[]>> {
    const exps = await this.experimentRepo.findByResearchProfile(profileId);
    return Result.ok(exps.map((e) => this.mapExperimentToDto(e)));
  }

  public async uploadResearchAsset(
    dto: UploadResearchAssetDto,
  ): Promise<Result<ResearchAssetOutputDto>> {
    try {
      const profileId = UniqueId.from(dto.profileId);
      const publicationId =
        dto.publicationId !== undefined && dto.publicationId !== ''
          ? UniqueId.from(dto.publicationId)
          : undefined;
      const projectId =
        dto.projectId !== undefined && dto.projectId !== ''
          ? UniqueId.from(dto.projectId)
          : undefined;
      const license =
        dto.license !== undefined && dto.license !== '' ? License.from(dto.license) : undefined;
      const mimeType =
        dto.mimeType !== undefined && dto.mimeType !== ''
          ? MediaType.from(dto.mimeType)
          : undefined;
      const fileSizeBytes =
        dto.fileSizeBytes !== undefined && dto.fileSizeBytes > 0
          ? FileSize.from(dto.fileSizeBytes)
          : undefined;

      const assetRes = ResearchAsset.create({
        profileId,
        publicationId,
        projectId,
        title: dto.title,
        description: dto.description,
        category: dto.category as ResearchAssetCategory,
        fileUrl: dto.fileUrl,
        mimeType,
        fileSizeBytes,
        license,
        visibility: dto.visibility as AssetVisibility,
        accessLevel: dto.accessLevel as AssetAccessLevel,
      });

      if (assetRes.isFailure) return Result.fail(assetRes.error);

      const asset = assetRes.value;
      await this.assetRepo.save(asset);

      return Result.ok(this.mapAssetToDto(asset));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err.message : String(err));
    }
  }

  public async getResearchAssetById(id: string): Promise<Result<ResearchAssetOutputDto>> {
    const asset = await this.assetRepo.findById(id);
    if (!asset) return Result.fail(`Research asset '${id}' not found.`);
    return Result.ok(this.mapAssetToDto(asset));
  }

  public async getResearchAssets(filters?: {
    profileId?: string;
    publicationId?: string;
    category?: string;
  }): Promise<Result<ResearchAssetOutputDto[]>> {
    let assets: ResearchAsset[] = [];
    if (filters?.publicationId !== undefined && filters.publicationId !== '') {
      assets = await this.assetRepo.findByPublication(filters.publicationId);
    } else if (filters?.profileId !== undefined && filters.profileId !== '') {
      assets = await this.assetRepo.findByResearchProfile(filters.profileId);
    } else {
      assets = await this.assetRepo.search('');
    }

    if (filters?.category !== undefined && filters.category !== '') {
      assets = assets.filter((a) => a.category === filters.category);
    }

    return Result.ok(assets.map((a) => this.mapAssetToDto(a)));
  }

  public async deleteResearchAsset(id: string): Promise<Result<void>> {
    await this.assetRepo.delete(id);
    return Result.ok();
  }

  // Mapper helpers
  private mapDatasetToDto(dataset: ResearchDataset): ResearchDatasetOutputDto {
    return {
      id: dataset.datasetId.value,
      profileId: dataset.profileId.value,
      title: dataset.title,
      description: dataset.description,
      doi: dataset.doi?.value,
      license: dataset.license?.value,
      visibility: dataset.visibility,
      accessLevel: dataset.accessLevel,
      storageProvider: dataset.storageProvider?.toString(),
      datasetUrl: dataset.datasetUrl?.value,
      field: dataset.field?.value,
      area: dataset.area?.value,
      versions: dataset.versions.map((v) => ({
        id: v.id.value,
        versionNumber: v.versionNumber.value,
        title: v.title,
        description: v.description,
        fileUrl: v.fileUrl,
        fileSizeBytes: v.fileSizeBytes.bytes,
        releaseDate: v.releaseDate.toISOString(),
        changelog: v.changelog,
      })),
      isPublished: dataset.isPublished,
      createdAt: dataset.createdAt.toISOString(),
      updatedAt: dataset.updatedAt.toISOString(),
    };
  }

  private mapRepositoryToDto(repo: Repository): RepositoryOutputDto {
    return {
      id: repo.id.value,
      name: repo.name,
      url: repo.url.value,
      provider: repo.provider,
      isPrivate: repo.isPrivate,
      defaultBranch: repo.defaultBranch,
      primaryLanguage: repo.primaryLanguage?.value,
      starsCount: repo.starsCount,
      forksCount: repo.forksCount,
      openIssuesCount: repo.openIssuesCount,
      description: repo.description,
    };
  }

  private mapSoftwareToDto(artifact: SoftwareArtifact): SoftwareArtifactOutputDto {
    return {
      id: artifact.artifactId.value,
      profileId: artifact.profileId.value,
      name: artifact.name,
      description: artifact.description,
      programmingLanguages: artifact.programmingLanguages.map((l) => l.value),
      frameworks: artifact.frameworks.map((f) => f.value),
      license: artifact.license?.value,
      visibility: artifact.visibility,
      repositories: artifact.repositories.map((r) => this.mapRepositoryToDto(r)),
      releases: artifact.releases.map((rel) => ({
        id: rel.id.value,
        version: rel.version.value,
        title: rel.title,
        tagName: rel.tagName,
        targetCommitish: rel.targetCommitish?.value,
        description: rel.description,
        isPrerelease: rel.isPrerelease,
        releasedAt: rel.releasedAt.toISOString(),
        downloadUrl: rel.downloadUrl,
      })),
      createdAt: artifact.createdAt.toISOString(),
      updatedAt: artifact.updatedAt.toISOString(),
    };
  }

  private mapExperimentToDto(exp: Experiment): ExperimentOutputDto {
    return {
      id: exp.id.value,
      title: exp.title,
      description: exp.description,
      projectId: exp.projectId,
      profileId: exp.profileId,
      parametersJson: exp.parametersJson,
      metricsJson: exp.metricsJson,
      status: exp.status,
      executedAt: exp.executedAt?.toISOString(),
    };
  }

  private mapAssetToDto(asset: ResearchAsset): ResearchAssetOutputDto {
    return {
      id: asset.assetId.value,
      profileId: asset.profileId.value,
      publicationId: asset.publicationId?.value,
      projectId: asset.projectId?.value,
      title: asset.title,
      description: asset.description,
      category: asset.category,
      fileUrl: asset.fileUrl,
      mimeType: asset.mimeType?.value,
      fileSizeBytes: asset.fileSizeBytes?.bytes,
      license: asset.license?.value,
      visibility: asset.visibility,
      accessLevel: asset.accessLevel,
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString(),
    };
  }
}
