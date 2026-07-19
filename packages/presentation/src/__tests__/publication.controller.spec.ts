import type { PublicationApplicationService } from '@rios/application';
import { Result } from '@rios/shared';
import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';

import { PublicationController } from '../controllers/publication.controller.js';

describe('PublicationController Unit Tests', () => {
  const mockCreatePublication = vi.fn();
  const mockService = {
    createPublication: mockCreatePublication,
    getPublicationById: vi.fn(),
    searchPublications: vi.fn(),
    getPublicationStatistics: vi.fn(),
    deletePublication: vi.fn(),
  } as unknown as PublicationApplicationService;

  const controller = new PublicationController(mockService);

  it('should handle createPublication request and return 201', async () => {
    const req = {
      body: {
        profileId: '11111111-1111-1111-1111-111111111111',
        title: 'Mastering the Game of Go',
        type: 'JOURNAL_ARTICLE',
      },
      context: { correlationId: 'corr-123' },
    } as unknown as Request;

    const mockStatus = vi.fn();
    const mockJson = vi.fn();

    const res = {
      status: mockStatus.mockReturnThis(),
      json: mockJson.mockReturnThis(),
    } as unknown as Response;

    const next = vi.fn();

    mockCreatePublication.mockResolvedValue(
      Result.ok({
        id: 'pub-999',
        profileId: '11111111-1111-1111-1111-111111111111',
        title: 'Mastering the Game of Go',
        type: 'JOURNAL_ARTICLE',
        status: 'DRAFT',
        keywords: [],
        citationCount: 0,
        authors: [],
        fundings: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );

    await controller.createPublication(req, res, next);
    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalled();
  });
});
