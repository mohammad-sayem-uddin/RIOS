import express, { json } from 'express';
import request from 'supertest';
import { describe, it, expect } from 'vitest';

import { SchemaValidator, createValidationMiddleware } from '../validation/index.js';

describe('Validation Pipeline', () => {
  const validator = new SchemaValidator({
    title: [
      SchemaValidator.required('title'),
      SchemaValidator.string('title'),
      SchemaValidator.minLength('title', 3),
    ],
  });

  it('should pass valid payloads', async () => {
    const app = express();
    app.use(json());
    app.post('/test', createValidationMiddleware(validator), (_req, res) => {
      res.status(200).json({ ok: true });
    });

    const response = await request(app).post('/test').send({ title: 'Valid Title' });
    const body = response.body as { ok: boolean };
    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
  });

  it('should reject invalid payloads with 400 Bad Request', async () => {
    const app = express();
    app.use(json());
    app.post('/test', createValidationMiddleware(validator), (_req, res) => {
      res.status(200).json({ ok: true });
    });

    const response = await request(app).post('/test').send({ title: 'a' });
    const body = response.body as { success: boolean; error: { code: string; details: string[] } };
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.details.length).toBeGreaterThan(0);
  });
});
