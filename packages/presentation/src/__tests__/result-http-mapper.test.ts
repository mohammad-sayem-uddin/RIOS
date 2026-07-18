import { Result } from '@rios/shared';
import express from 'express';
import request from 'supertest';
import { describe, it, expect } from 'vitest';

import { ResultHttpMapper } from '../responders/result-http-mapper.js';

describe('ResultHttpMapper', () => {
  it('should map Result.ok to 200/201 with success envelope', async () => {
    const app = express();
    app.get('/success', (_req, res) => {
      ResultHttpMapper.mapResult(res, Result.ok({ id: '123' }), 201);
    });

    const response = await request(app).get('/success');
    const body = response.body as { success: boolean; data: { id: string } };
    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.id).toBe('123');
  });

  it('should map Result.fail not found to 404', async () => {
    const app = express();
    app.get('/notfound', (_req, res) => {
      ResultHttpMapper.mapResult(res, Result.fail('ResearchIdentity not found for id 999'));
    });

    const response = await request(app).get('/notfound');
    const body = response.body as { success: boolean; error: { code: string } };
    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('RESOURCE_NOT_FOUND');
  });

  it('should map Result.fail conflict to 409', async () => {
    const app = express();
    app.get('/conflict', (_req, res) => {
      ResultHttpMapper.mapResult(res, Result.fail('Concurrency conflict detected'));
    });

    const response = await request(app).get('/conflict');
    const body = response.body as { success: boolean; error: { code: string } };
    expect(response.status).toBe(409);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('CONCURRENCY_CONFLICT');
  });
});
