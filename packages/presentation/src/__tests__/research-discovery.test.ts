import type { ResearchDiscoveryApplicationService } from '@rios/application';
import { Result } from '@rios/shared';
import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { ResearchDiscoveryController } from '../controllers/research-discovery.controller.js';
import { createResearchDiscoveryRouter } from '../routes/research-discovery.routes.js';

describe('Research Discovery Presentation Unit Tests', () => {
  const globalSearchMock = vi.fn().mockResolvedValue(
    Result.ok({
      results: [],
      total: 0,
      facets: [],
      page: 1,
      limit: 20,
    }),
  );

  const publishProfileMock = vi.fn().mockResolvedValue(
    Result.ok({
      id: 'prof-1',
      userId: 'usr-1',
      slug: 'dr-jane',
      title: 'Dr. Jane',
      researchAreas: [],
      visibility: 'PUBLIC',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  );

  const mockService: ResearchDiscoveryApplicationService = {
    publishProfile: publishProfileMock,
    unpublishProfile: vi.fn().mockResolvedValue(Result.ok({})),
    updateSearchIndex: vi.fn().mockResolvedValue(Result.ok({ indexedCount: 1 })),
    createPortfolio: vi.fn().mockResolvedValue(Result.ok({})),
    globalSearch: globalSearchMock,
    searchResearchers: vi
      .fn()
      .mockResolvedValue(Result.ok({ results: [], total: 0, facets: [], page: 1, limit: 20 })),
    searchPublications: vi
      .fn()
      .mockResolvedValue(Result.ok({ results: [], total: 0, facets: [], page: 1, limit: 20 })),
    searchProjects: vi
      .fn()
      .mockResolvedValue(Result.ok({ results: [], total: 0, facets: [], page: 1, limit: 20 })),
    searchDatasets: vi
      .fn()
      .mockResolvedValue(Result.ok({ results: [], total: 0, facets: [], page: 1, limit: 20 })),
    searchInstitutions: vi.fn().mockResolvedValue(Result.ok([])),
    getPublicProfile: vi.fn().mockResolvedValue(Result.ok({})),
    getPortfolio: vi.fn().mockResolvedValue(Result.ok({})),
  };

  const controller = new ResearchDiscoveryController(mockService);
  const router = createResearchDiscoveryRouter({ controller });
  const app = express();
  app.use(express.json());
  app.use('/api/v1', router);

  it('GET /api/v1/search should return HTTP 200', async () => {
    const res = await request(app).get('/api/v1/search?q=AI&page=1&limit=10');
    expect(res.status).toBe(200);
    expect(globalSearchMock).toHaveBeenCalledWith({
      query: 'AI',
      category: undefined,
      institution: undefined,
      authorName: undefined,
      sortField: undefined,
      sortDirection: undefined,
      page: 1,
      limit: 10,
    });
  });

  it('POST /api/v1/profiles/publish should publish profile HTTP 200', async () => {
    const res = await request(app).post('/api/v1/profiles/publish').send({
      profileId: 'prof-1',
      userId: 'usr-1',
      slug: 'dr-jane',
      title: 'Dr. Jane',
    });
    expect(res.status).toBe(200);
    expect(publishProfileMock).toHaveBeenCalled();
  });
});
