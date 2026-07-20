import type { ResearchAssetsApplicationService } from '@rios/application';
import { CompositionRoot, DITokens } from '@rios/infrastructure';
import express, { json } from 'express';
import supertest from 'supertest';
import { describe, expect, it } from 'vitest';

import { ResearchAssetsController } from '../controllers/research-assets.controller.js';
import { createResearchAssetsRouter } from '../routes/research-assets.routes.js';

describe('Research Assets Presentation Layer Tests', () => {
  const root = new CompositionRoot();
  const service = root
    .getContainer()
    .resolve<ResearchAssetsApplicationService>(DITokens.ResearchAssetsApplicationService);
  const controller = new ResearchAssetsController(service);
  const router = createResearchAssetsRouter({ controller });

  const app = express();
  app.use(json());
  app.use('/api/v1', router);

  it('should create a research dataset via POST /api/v1/datasets', async () => {
    const res = await supertest(app).post('/api/v1/datasets').send({
      profileId: '11111111-1111-4111-a111-111111111111',
      title: 'Neural Network Benchmark Dataset',
      description: 'Comprehensive dataset for vision models',
      visibility: 'PUBLIC',
      license: 'MIT',
    });

    expect(res.status).toBe(201);
    const body = res.body as { data: { title: string } };
    expect(body.data.title).toBe('Neural Network Benchmark Dataset');
  });

  it('should search datasets via GET /api/v1/datasets', async () => {
    const res = await supertest(app).get('/api/v1/datasets').query({ q: 'Neural' });

    expect(res.status).toBe(200);
    const body = res.body as { data: unknown[] };
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('should create a repository via POST /api/v1/repositories', async () => {
    const res = await supertest(app).post('/api/v1/repositories').send({
      name: 'rios-presentation-test',
      url: 'https://github.com/rios/presentation.git',
      provider: 'GITHUB',
    });

    expect(res.status).toBe(201);
    const body = res.body as { data: { name: string } };
    expect(body.data.name).toBe('rios-presentation-test');
  });

  it('should upload a research asset via POST /api/v1/research-assets', async () => {
    const res = await supertest(app).post('/api/v1/research-assets').send({
      profileId: '11111111-1111-4111-a111-111111111111',
      title: 'Poster for AI Summit',
      category: 'POSTER',
      fileUrl: 'https://storage.rios.org/poster.pdf',
      visibility: 'PUBLIC',
      license: 'CC-BY-4.0',
    });

    expect(res.status).toBe(201);
    const body = res.body as { data: { category: string } };
    expect(body.data.category).toBe('POSTER');
  });
});
