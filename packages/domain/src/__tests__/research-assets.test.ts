import { UniqueId } from '@rios/shared';
import { describe, expect, it } from 'vitest';

import {
  AssetDOI,
  AssetVisibility,
  DatasetVersion,
  DatasetVersionReleasedEvent,
  FileSize,
  License,
  MediaType,
  MissingLicenseForPublicAssetError,
  ProgrammingLanguage,
  Release,
  Repository,
  RepositoryURL,
  ResearchAsset,
  ResearchAssetCategory,
  ResearchDataset,
  SemanticVersion,
  SoftwareArtifact,
} from '../index.js';

describe('Research Assets Domain Unit Tests', () => {
  const profileId = UniqueId.create();

  describe('Value Objects', () => {
    it('should validate SemanticVersion correctly', () => {
      const v1 = SemanticVersion.create('1.0.0').value;
      const v2 = SemanticVersion.create('v2.1.0-alpha').value;
      expect(v1.major).toBe(1);
      expect(v2.isGreaterThan(v1)).toBe(true);
      expect(SemanticVersion.create('invalid').isFailure).toBe(true);
    });

    it('should validate RepositoryURL correctly', () => {
      const urlRes = RepositoryURL.create('https://github.com/rios/core.git');
      expect(urlRes.isSuccess).toBe(true);
      expect(urlRes.value.value).toBe('https://github.com/rios/core.git');

      const invalidUrl = RepositoryURL.create('not-a-url');
      expect(invalidUrl.isFailure).toBe(true);
    });

    it('should format FileSize to human readable format', () => {
      const size = FileSize.create(1048576 * 5).value;
      expect(size.toHumanReadable()).toBe('5.00 MB');
    });
  });

  describe('ResearchDataset Aggregate', () => {
    it('should enforce license requirement for public datasets', () => {
      const result = ResearchDataset.create({
        profileId,
        title: 'Open Genomic Dataset',
        description: 'Genomic sequences',
        visibility: AssetVisibility.PUBLIC,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe(new MissingLicenseForPublicAssetError().message);
    });

    it('should create public dataset with valid license and publish with DOI', () => {
      const dataset = ResearchDataset.create({
        profileId,
        title: 'Open Genomic Dataset',
        description: 'Genomic sequences',
        visibility: AssetVisibility.PUBLIC,
        license: License.from('CC-BY-4.0'),
      }).value;

      expect(dataset.title).toBe('Open Genomic Dataset');
      expect(dataset.domainEvents.length).toBe(1);

      const doi = AssetDOI.create('10.1234/genomics.2026').value;
      dataset.publish(doi);

      expect(dataset.isPublished).toBe(true);
      expect(dataset.doi?.value).toBe('10.1234/genomics.2026');
      expect(dataset.domainEvents.length).toBe(2);
    });

    it('should add versions and emit DatasetVersionReleasedEvent', () => {
      const dataset = ResearchDataset.create({
        profileId,
        title: 'Versioned Dataset',
        description: 'Time series data',
        visibility: AssetVisibility.PRIVATE,
      }).value;

      const version1 = DatasetVersion.create({
        versionNumber: SemanticVersion.from('1.0.0'),
        title: 'v1.0.0 Initial',
        fileUrl: 'https://storage.example.com/v1.csv',
        fileSizeBytes: FileSize.from(1024),
      }).value;

      const addRes = dataset.addVersion(version1);
      expect(addRes.isSuccess).toBe(true);
      expect(dataset.versions.length).toBe(1);

      const event = dataset.domainEvents.find((e) => e instanceof DatasetVersionReleasedEvent);
      expect(event).toBeDefined();
    });
  });

  describe('SoftwareArtifact Aggregate', () => {
    it('should link repository and require repository before adding release', () => {
      const artifact = SoftwareArtifact.create({
        profileId,
        name: 'RIOS Core Engine',
        description: 'Research Identity Operating System',
        visibility: AssetVisibility.PUBLIC,
        license: License.from('MIT'),
        programmingLanguages: [ProgrammingLanguage.from('TypeScript')],
      }).value;

      const release = Release.create({
        version: SemanticVersion.from('1.0.0'),
        title: 'Release 1.0.0',
        tagName: 'v1.0.0',
      }).value;

      // Attempt release without repository attached
      const releaseFail = artifact.addRelease(release);
      expect(releaseFail.isFailure).toBe(true);

      const repo = Repository.create({
        name: 'rios-core',
        url: RepositoryURL.create('https://github.com/rios/core.git').value,
      }).value;

      const linkRes = artifact.linkRepository(repo);
      expect(linkRes.isSuccess).toBe(true);
      expect(artifact.repositories.length).toBe(1);

      const releaseOk = artifact.addRelease(release);
      expect(releaseOk.isSuccess).toBe(true);
      expect(artifact.releases.length).toBe(1);
    });
  });

  describe('ResearchAsset Aggregate', () => {
    it('should create general research asset successfully', () => {
      const asset = ResearchAsset.create({
        profileId,
        title: 'AI Governance Keynote Presentation',
        category: ResearchAssetCategory.PRESENTATION,
        visibility: AssetVisibility.PUBLIC,
        license: License.from('CC-BY-4.0'),
        fileUrl: 'https://storage.example.com/slides.pdf',
        mimeType: MediaType.from('application/pdf'),
        fileSizeBytes: FileSize.from(2048576),
      }).value;

      expect(asset.title).toBe('AI Governance Keynote Presentation');
      expect(asset.category).toBe(ResearchAssetCategory.PRESENTATION);
      expect(asset.domainEvents.length).toBe(1);
    });
  });
});
