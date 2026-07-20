import type { ResearchAssetsApplicationService } from '@rios/application';
import { describe, expect, it } from 'vitest';

import { CompositionRoot, DITokens } from '../index.js';

describe('Research Assets Infrastructure Integration Tests', () => {
  const root = new CompositionRoot();
  const service = root
    .getContainer()
    .resolve<ResearchAssetsApplicationService>(DITokens.ResearchAssetsApplicationService);

  it('should resolve ResearchAssetsApplicationService from DI Container', () => {
    expect(service).toBeDefined();
  });

  it('should create and search datasets via application service with in-memory persistence', async () => {
    const createRes = await service.createDataset({
      profileId: '11111111-1111-4111-a111-111111111111',
      title: 'Global Climate Change Dataset 2026',
      description: 'Global temperature anomalies',
      visibility: 'PUBLIC',
      license: 'CC-BY-4.0',
      storageProviderType: 'ZENODO',
      field: 'Climate Science',
      area: 'Atmospheric Physics',
    });

    expect(createRes.isSuccess).toBe(true);
    const dataset = createRes.value;
    expect(dataset.title).toBe('Global Climate Change Dataset 2026');

    const searchRes = await service.searchDatasets('Climate');
    expect(searchRes.isSuccess).toBe(true);
    expect(searchRes.value.length).toBeGreaterThanOrEqual(1);
  });

  it('should create repository and link to software artifact', async () => {
    const repoRes = await service.createRepository({
      name: 'rios-research-assets',
      url: 'https://github.com/rios/research-assets.git',
      provider: 'GITHUB',
    });

    expect(repoRes.isSuccess).toBe(true);
    const repo = repoRes.value;
    expect(repo.name).toBe('rios-research-assets');

    const softwareRes = await service.createSoftwareArtifact({
      profileId: '11111111-1111-4111-a111-111111111111',
      name: 'RIOS Research Assets Package',
      description: 'Scholarly resource management',
      visibility: 'PUBLIC',
      license: 'MIT',
      repositoryId: repo.id,
    });

    expect(softwareRes.isSuccess).toBe(true);
    expect(softwareRes.value.repositories.length).toBe(1);
  });

  it('should upload and retrieve general research asset', async () => {
    const uploadRes = await service.uploadResearchAsset({
      profileId: '11111111-1111-4111-a111-111111111111',
      title: 'Conference Presentation Slides',
      category: 'PRESENTATION',
      fileUrl: 'https://storage.rios.org/slides.pdf',
      visibility: 'PUBLIC',
      license: 'CC-BY-4.0',
    });

    expect(uploadRes.isSuccess).toBe(true);
    expect(uploadRes.value.category).toBe('PRESENTATION');

    const getRes = await service.getResearchAssetById(uploadRes.value.id);
    expect(getRes.isSuccess).toBe(true);
    expect(getRes.value.title).toBe('Conference Presentation Slides');
  });
});
