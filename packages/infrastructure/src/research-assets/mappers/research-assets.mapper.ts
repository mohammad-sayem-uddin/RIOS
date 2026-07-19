/**
 * Mappers for Research Assets Prisma Models <-> Domain Aggregates / Entities
 */

import {
  DatasetVersion as PrismaDatasetVersion,
  Experiment as PrismaExperiment,
  Repository as PrismaRepository,
  ResearchAsset as PrismaResearchAsset,
  ResearchDataset as PrismaResearchDataset,
  SoftwareArtifact as PrismaSoftwareArtifact,
  SoftwareRelease as PrismaSoftwareRelease,
} from '@prisma/client';
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
import { UniqueId } from '@rios/shared';

export type PrismaDatasetWithVersions = PrismaResearchDataset & {
  versions: PrismaDatasetVersion[];
};

export type PrismaSoftwareWithRelations = PrismaSoftwareArtifact & {
  repositories: PrismaRepository[];
  releases: PrismaSoftwareRelease[];
};

export class ResearchAssetsMapper {
  public static toDatasetDomain(raw: PrismaDatasetWithVersions): ResearchDataset {
    const versions = (raw.versions ?? []).map(
      (v) =>
        DatasetVersion.create(
          {
            versionNumber: SemanticVersion.from(v.versionNumber),
            title: v.title,
            description:
              v.description !== null && v.description !== undefined ? v.description : undefined,
            fileUrl: v.fileUrl,
            fileSizeBytes: FileSize.from(Number(v.fileSizeBytes)),
            checksum:
              v.checksum !== null && v.checksum !== undefined && v.checksum !== ''
                ? Checksum.from('sha256', v.checksum)
                : undefined,
            releaseDate: v.releaseDate,
            changelog: v.changelog !== null && v.changelog !== undefined ? v.changelog : undefined,
          },
          UniqueId.from(v.id),
        ).value,
    );

    return ResearchDataset.create(
      {
        profileId: UniqueId.from(raw.profileId),
        title: raw.title,
        description: raw.description,
        doi:
          raw.doi !== null && raw.doi !== undefined && raw.doi !== ''
            ? AssetDOI.create(raw.doi).value
            : undefined,
        license:
          raw.license !== null && raw.license !== undefined && raw.license !== ''
            ? License.from(raw.license)
            : undefined,
        visibility: raw.visibility as AssetVisibility,
        accessLevel: raw.accessLevel as AssetAccessLevel,
        storageProvider:
          raw.storageProvider !== null &&
          raw.storageProvider !== undefined &&
          raw.storageProvider !== ''
            ? StorageProvider.create(raw.storageProvider as StorageProviderType)
            : undefined,
        datasetUrl:
          raw.datasetUrl !== null && raw.datasetUrl !== undefined && raw.datasetUrl !== ''
            ? DatasetURL.from(raw.datasetUrl)
            : undefined,
        field:
          raw.field !== null && raw.field !== undefined && raw.field !== ''
            ? ResearchField.from(raw.field)
            : undefined,
        area:
          raw.area !== null && raw.area !== undefined && raw.area !== ''
            ? ResearchArea.from(raw.area)
            : undefined,
        versions,
        isPublished: raw.isPublished,
      },
      UniqueId.from(raw.id),
    ).value;
  }

  public static toRepositoryDomain(raw: PrismaRepository): Repository {
    return Repository.create(
      {
        name: raw.name,
        url: RepositoryURL.create(raw.url).value,
        provider: raw.provider,
        isPrivate: raw.isPrivate,
        defaultBranch: raw.defaultBranch,
        primaryLanguage:
          raw.primaryLanguage !== null &&
          raw.primaryLanguage !== undefined &&
          raw.primaryLanguage !== ''
            ? ProgrammingLanguage.from(raw.primaryLanguage)
            : undefined,
        starsCount: raw.starsCount,
        forksCount: raw.forksCount,
        openIssuesCount: raw.openIssuesCount,
        description:
          raw.description !== null && raw.description !== undefined ? raw.description : undefined,
      },
      UniqueId.from(raw.id),
    ).value;
  }

  public static toSoftwareDomain(raw: PrismaSoftwareWithRelations): SoftwareArtifact {
    const repositories = (raw.repositories ?? []).map((r) => this.toRepositoryDomain(r));
    const releases = (raw.releases ?? []).map(
      (rel) =>
        Release.create(
          {
            version: SemanticVersion.from(rel.version),
            title: rel.title,
            tagName: rel.tagName,
            targetCommitish:
              rel.targetCommitish !== null &&
              rel.targetCommitish !== undefined &&
              rel.targetCommitish !== ''
                ? GitCommitHash.from(rel.targetCommitish)
                : undefined,
            description:
              rel.description !== null && rel.description !== undefined
                ? rel.description
                : undefined,
            isPrerelease: rel.isPrerelease,
            releasedAt: rel.releasedAt,
            downloadUrl:
              rel.downloadUrl !== null && rel.downloadUrl !== undefined
                ? rel.downloadUrl
                : undefined,
          },
          UniqueId.from(rel.id),
        ).value,
    );

    const langs =
      raw.programmingLanguages !== null &&
      raw.programmingLanguages !== undefined &&
      raw.programmingLanguages !== ''
        ? raw.programmingLanguages.split(',').map((l) => ProgrammingLanguage.from(l.trim()))
        : [];

    return SoftwareArtifact.create(
      {
        profileId: UniqueId.from(raw.profileId),
        name: raw.name,
        description: raw.description,
        programmingLanguages: langs,
        license:
          raw.license !== null && raw.license !== undefined && raw.license !== ''
            ? License.from(raw.license)
            : undefined,
        visibility: raw.visibility as AssetVisibility,
        repositories,
        releases,
      },
      UniqueId.from(raw.id),
    ).value;
  }

  public static toExperimentDomain(raw: PrismaExperiment): Experiment {
    return Experiment.create(
      {
        title: raw.title,
        description:
          raw.description !== null && raw.description !== undefined ? raw.description : undefined,
        projectId:
          raw.projectId !== null && raw.projectId !== undefined ? raw.projectId : undefined,
        profileId:
          raw.profileId !== null && raw.profileId !== undefined ? raw.profileId : undefined,
        parametersJson:
          raw.parametersJson !== null && raw.parametersJson !== undefined
            ? raw.parametersJson
            : undefined,
        metricsJson:
          raw.metricsJson !== null && raw.metricsJson !== undefined ? raw.metricsJson : undefined,
        status: raw.status,
        executedAt:
          raw.executedAt !== null && raw.executedAt !== undefined ? raw.executedAt : undefined,
      },
      UniqueId.from(raw.id),
    ).value;
  }

  public static toAssetDomain(raw: PrismaResearchAsset): ResearchAsset {
    return ResearchAsset.create(
      {
        profileId: UniqueId.from(raw.profileId),
        publicationId:
          raw.publicationId !== null && raw.publicationId !== undefined && raw.publicationId !== ''
            ? UniqueId.from(raw.publicationId)
            : undefined,
        projectId:
          raw.projectId !== null && raw.projectId !== undefined && raw.projectId !== ''
            ? UniqueId.from(raw.projectId)
            : undefined,
        title: raw.title,
        description:
          raw.description !== null && raw.description !== undefined ? raw.description : undefined,
        category: raw.category as ResearchAssetCategory,
        fileUrl:
          raw.fileUrl !== null && raw.fileUrl !== undefined && raw.fileUrl !== ''
            ? raw.fileUrl
            : undefined,
        mimeType:
          raw.mimeType !== null && raw.mimeType !== undefined && raw.mimeType !== ''
            ? MediaType.from(raw.mimeType)
            : undefined,
        fileSizeBytes:
          raw.fileSizeBytes !== null &&
          raw.fileSizeBytes !== undefined &&
          Number(raw.fileSizeBytes) > 0
            ? FileSize.from(Number(raw.fileSizeBytes))
            : undefined,
        license:
          raw.license !== null && raw.license !== undefined && raw.license !== ''
            ? License.from(raw.license)
            : undefined,
        visibility: raw.visibility as AssetVisibility,
        accessLevel: raw.accessLevel as AssetAccessLevel,
      },
      UniqueId.from(raw.id),
    ).value;
  }
}
