import type { IAiIntelligenceApplicationService } from '@rios/application';
import { Result } from '@rios/shared';
import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { AiIntelligenceController } from '../controllers/ai-intelligence.controller.ts';
import { createAiIntelligenceRouter } from '../routes/ai-intelligence.routes.js';

interface TestResponseBody {
  success: boolean;
  data: unknown;
}

describe('AI Research Intelligence Presentation Tests (Sprint 13)', () => {
  const mockService: IAiIntelligenceApplicationService = {
    generateEmbedding: vi.fn().mockResolvedValue(
      Result.ok({
        id: 'emb-1',
        entityId: 'pub-100',
        entityType: 'PUBLICATION',
        model: 'text-embedding-3-large',
        dimension: 1536,
        status: 'ACTIVE',
        vector: [0.1, 0.2],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    ),
    rebuildKnowledgeGraph: vi.fn().mockResolvedValue(
      Result.ok({
        id: 'kg-1',
        profileId: 'prof-100',
        nodes: [],
        edges: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    ),
    generateRecommendations: vi.fn().mockResolvedValue(
      Result.ok([
        {
          id: 'rec-1',
          recommendationType: 'PUBLICATION',
          targetEntityId: 'prof-100',
          recommendedEntityId: 'pub-999',
          confidence: 90,
          score: 0.88,
          explanation: 'High vector similarity',
          createdAt: new Date().toISOString(),
        },
      ]),
    ),
    updateResearchTopics: vi.fn().mockResolvedValue(Result.ok({ success: true, score: 95.0 })),
    getRecommendations: vi.fn().mockResolvedValue(Result.ok([])),
    getSimilarResearchers: vi.fn().mockResolvedValue(Result.ok([])),
    getResearchTrends: vi.fn().mockResolvedValue(
      Result.ok([
        {
          topicName: 'Graph AI',
          trendScore: 92.0,
          growthRate: 40.0,
          publicationVolume: 500,
          period: '2026-Q2',
        },
      ]),
    ),
    getResearchGaps: vi.fn().mockResolvedValue(Result.ok([])),
    getKnowledgeGraph: vi.fn().mockResolvedValue(
      Result.ok({
        id: 'kg-1',
        profileId: 'prof-100',
        nodes: [],
        edges: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    ),
    getEmbeddingStatus: vi.fn().mockResolvedValue(Result.ok(null)),
  };

  const controller = new AiIntelligenceController(mockService);
  const router = createAiIntelligenceRouter({ controller });

  const app = express();
  app.use(express.json());
  app.use('/api/v1', router);

  it('POST /api/v1/ai/embeddings should return 201', async () => {
    const res = await request(app).post('/api/v1/ai/embeddings').send({
      entityId: 'pub-100',
      entityType: 'PUBLICATION',
      textToEmbed: 'AI Research Abstract',
    });

    expect(res.status).toBe(201);
    const body = res.body as TestResponseBody;
    expect(body.success).toBe(true);
    expect((body.data as { id: string }).id).toBe('emb-1');
  });

  it('POST /api/v1/ai/recommendations should return 201', async () => {
    const res = await request(app).post('/api/v1/ai/recommendations').send({
      profileId: 'prof-100',
    });

    expect(res.status).toBe(201);
    const body = res.body as TestResponseBody;
    expect(body.success).toBe(true);
    expect((body.data as unknown[]).length).toBe(1);
  });

  it('GET /api/v1/ai/research-trends should return 200', async () => {
    const res = await request(app).get('/api/v1/ai/research-trends');
    expect(res.status).toBe(200);
    const body = res.body as TestResponseBody;
    expect(body.success).toBe(true);
  });

  it('GET /api/v1/knowledge-graph should return 200', async () => {
    const res = await request(app).get('/api/v1/knowledge-graph?profileId=prof-100');
    expect(res.status).toBe(200);
    const body = res.body as TestResponseBody;
    expect(body.success).toBe(true);
  });
});
