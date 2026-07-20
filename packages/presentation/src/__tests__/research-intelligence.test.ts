import type { ResearchIntelligenceApplicationService } from '@rios/application';
import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { ResearchIntelligenceController } from '../controllers/research-intelligence.controller.js';
import { createResearchIntelligenceRouter } from '../routes/research-intelligence.routes.js';

describe('Research Intelligence Presentation Unit Tests', () => {
  const getTimelineMock = vi.fn().mockResolvedValue({
    isSuccess: true,
    isFailure: false,
    value: { id: 't1', profileId: 'p1', events: [] },
  });

  const createTimelineEventMock = vi.fn().mockResolvedValue({
    isSuccess: true,
    isFailure: false,
    value: { id: 't1', profileId: 'p1', events: [] },
  });

  const getCollaborationNetworkMock = vi.fn().mockResolvedValue({
    isSuccess: true,
    isFailure: false,
    value: { id: 'c1', profileId: 'p1', collaborations: [] },
  });

  const getCitationStatisticsMock = vi.fn().mockResolvedValue({
    isSuccess: true,
    isFailure: false,
    value: { profileId: 'p1', totalCitations: 100, hIndex: 10, i10Index: 12, citationHistory: [] },
  });

  const mockService: ResearchIntelligenceApplicationService = {
    createTimelineEvent: createTimelineEventMock,
    updateTimeline: vi.fn().mockResolvedValue({
      isSuccess: true,
      isFailure: false,
      value: { id: 't1', profileId: 'p1', events: [] },
    }),
    createCollaboration: vi.fn().mockResolvedValue({
      isSuccess: true,
      isFailure: false,
      value: { id: 'c1', profileId: 'p1', collaborations: [] },
    }),
    removeCollaboration: vi.fn().mockResolvedValue({
      isSuccess: true,
      isFailure: false,
      value: undefined,
    }),
    calculateResearchMetrics: vi.fn().mockResolvedValue({
      isSuccess: true,
      isFailure: false,
      value: { id: 'a1', profileId: 'p1', metrics: [] },
    }),
    getTimeline: getTimelineMock,
    getCollaborationNetwork: getCollaborationNetworkMock,
    getResearchAnalytics: vi.fn().mockResolvedValue({
      isSuccess: true,
      isFailure: false,
      value: { id: 'a1', profileId: 'p1', metrics: [] },
    }),
    getCitationStatistics: getCitationStatisticsMock,
    getResearchImpact: vi.fn().mockResolvedValue({
      isSuccess: true,
      isFailure: false,
      value: { profileId: 'p1', impactScore: 4.5, rgScore: 28.0, metrics: [] },
    }),
  };

  const controller = new ResearchIntelligenceController(mockService);
  const router = createResearchIntelligenceRouter({ controller });
  const app = express();
  app.use(express.json());
  app.use('/api/v1', router);

  it('GET /api/v1/timeline should return timeline HTTP 200', async () => {
    const res = await request(app).get('/api/v1/timeline?profileId=p1');
    expect(res.status).toBe(200);
    expect(getTimelineMock).toHaveBeenCalledWith('p1');
  });

  it('POST /api/v1/timeline should create timeline event HTTP 201', async () => {
    const res = await request(app).post('/api/v1/timeline').send({
      profileId: 'p1',
      eventType: 'publication',
      title: 'Graph Neural Networks Paper',
      eventDate: '2026-06-01',
    });
    expect(res.status).toBe(201);
    expect(createTimelineEventMock).toHaveBeenCalled();
  });

  it('GET /api/v1/collaborations should return network HTTP 200', async () => {
    const res = await request(app).get('/api/v1/collaborations?profileId=p1');
    expect(res.status).toBe(200);
    expect(getCollaborationNetworkMock).toHaveBeenCalledWith('p1');
  });

  it('GET /api/v1/citations should return citation stats HTTP 200', async () => {
    const res = await request(app).get('/api/v1/citations?profileId=p1');
    expect(res.status).toBe(200);
    const body = res.body as { data: { totalCitations: number } };
    expect(body.data.totalCitations).toBe(100);
  });
});
