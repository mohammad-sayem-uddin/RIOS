import express from 'express';
import request from 'supertest';
import { describe, it, expect } from 'vitest';

import {
  createRequestIdMiddleware,
  createCorrelationIdMiddleware,
  createRequestContextMiddleware,
  REQUEST_ID_HEADER,
  CORRELATION_ID_HEADER,
} from '../middleware/index.js';

describe('Presentation Middleware Pipeline', () => {
  it('should generate request ID and correlation ID headers when omitted by client', async () => {
    const app = express();
    app.use(createRequestIdMiddleware());
    app.use(createCorrelationIdMiddleware());
    app.use(createRequestContextMiddleware());

    app.get('/test', (req, res) => {
      res.json({
        requestId: req.context?.requestId,
        correlationId: req.context?.correlationId,
      });
    });

    const response = await request(app).get('/test');
    const body = response.body as { requestId?: string; correlationId?: string };
    expect(response.status).toBe(200);
    expect(response.headers[REQUEST_ID_HEADER]).toBeDefined();
    expect(response.headers[CORRELATION_ID_HEADER]).toBeDefined();
    expect(body.requestId).toBe(response.headers[REQUEST_ID_HEADER]);
    expect(body.correlationId).toBe(response.headers[CORRELATION_ID_HEADER]);
  });

  it('should propagate client provided correlation ID', async () => {
    const app = express();
    app.use(createRequestIdMiddleware());
    app.use(createCorrelationIdMiddleware());
    app.use(createRequestContextMiddleware());

    app.get('/test', (req, res) => {
      res.json({ correlationId: req.context?.correlationId });
    });

    const customCorrelationId = 'client-corr-12345';
    const response = await request(app)
      .get('/test')
      .set(CORRELATION_ID_HEADER, customCorrelationId);

    const body = response.body as { correlationId?: string };
    expect(response.status).toBe(200);
    expect(response.headers[CORRELATION_ID_HEADER]).toBe(customCorrelationId);
    expect(body.correlationId).toBe(customCorrelationId);
  });
});
