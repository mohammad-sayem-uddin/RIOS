import type { ResearchIdentityApplicationService } from '@rios/application';
import type { InfrastructureHealthCheckService } from '@rios/infrastructure';
import { Result, UniqueId } from '@rios/shared';
import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';

import { bootstrapPresentationServer } from '../bootstrap/bootstrap-application.js';

describe('Presentation Routes & Controllers Integration', () => {
  it('should process establishResearchIdentity via POST /api/v1/research-identities', async () => {
    const establishFn = vi.fn().mockResolvedValue(Result.ok(UniqueId.create('test-id-123')));
    const mockApplicationService: ResearchIdentityApplicationService = {
      establishResearchIdentity: establishFn,
      refineResearchVision: vi.fn(),
      incorporateResearchArea: vi.fn(),
      archiveResearchArea: vi.fn(),
      poseResearchQuestion: vi.fn(),
      pursueResearchGoal: vi.fn(),
      retireResearchGoal: vi.fn(),
      documentContribution: vi.fn(),
      reshapeResearchAgenda: vi.fn(),
      establishPhilosophy: vi.fn(),
      evolvePhilosophy: vi.fn(),
      chronicleEvolution: vi.fn(),
      retrieveResearchIdentity: vi
        .fn()
        .mockResolvedValue(Result.ok({ id: 'test-id-123', stage: 'EarlyCareer', focus: 'AI' })),
      discoverResearchIdentities: vi.fn().mockResolvedValue(Result.ok([])),
      exploreResearchIdentities: vi.fn().mockResolvedValue(Result.ok([])),
    };

    const server = bootstrapPresentationServer({
      applicationService: mockApplicationService,
    });

    const response = await request(server.app).post('/api/v1/research-identities').send({
      primaryFocus: 'Artificial Intelligence',
      stage: 'EarlyCareer',
      visionStatement: 'Advance trustworthy autonomous systems',
      timeHorizon: 'TenYears',
    });

    const body = response.body as { success: boolean; data: { id: string } };
    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.id).toBe('test-id-123');
    expect(establishFn).toHaveBeenCalledTimes(1);
  });

  it('should serve health probes with mock HealthCheckService', async () => {
    const mockApplicationService = {} as ResearchIdentityApplicationService;
    const mockHealthService: InfrastructureHealthCheckService = {
      check: vi.fn().mockResolvedValue({
        status: 'UP',
        timestamp: new Date().toISOString(),
        components: {
          database: { status: 'UP', details: {} },
          config: { status: 'UP', details: {} },
          repositories: { status: 'UP', details: {} },
          outbox: { status: 'UP', details: {} },
        },
      }),
    };

    const server = bootstrapPresentationServer({
      applicationService: mockApplicationService,
      healthService: mockHealthService,
    });

    const liveRes = await request(server.app).get('/health/live');
    const liveBody = liveRes.body as { status: string };
    expect(liveRes.status).toBe(200);
    expect(liveBody.status).toBe('UP');

    const healthRes = await request(server.app).get('/health');
    const healthBody = healthRes.body as { status: string };
    expect(healthRes.status).toBe(200);
    expect(healthBody.status).toBe('UP');
  });

  it('should serve swagger OpenAPI spec and docs UI', async () => {
    const mockApplicationService = {} as ResearchIdentityApplicationService;
    const server = bootstrapPresentationServer({
      applicationService: mockApplicationService,
    });

    const specRes = await request(server.app).get('/docs/json');
    const specBody = specRes.body as { openapi: string };
    expect(specRes.status).toBe(200);
    expect(specBody.openapi).toBe('3.0.3');

    const uiRes = await request(server.app).get('/docs');
    expect(uiRes.status).toBe(200);
    expect(uiRes.text).toContain('SwaggerUIBundle');
  });
});
