import {
  ProfileSlug,
  PublicProfileRepository,
  PublicResearchProfile,
  SearchRepository,
  VisibilityLevel,
} from '@rios/domain';
import { describe, expect, it, vi } from 'vitest';

import { PublishProfileCommandHandler, UpdateSearchIndexCommandHandler } from '../index.js';

describe('Discovery & Search Application Layer', () => {
  const saveProfileMock = vi.fn().mockResolvedValue(undefined);
  const saveSearchMock = vi.fn().mockResolvedValue(undefined);

  const mockProfileRepo: PublicProfileRepository = {
    save: saveProfileMock,
    findById: vi.fn().mockResolvedValue(null),
    findBySlug: vi.fn().mockResolvedValue(null),
    findByUserId: vi.fn().mockResolvedValue(null),
    delete: vi.fn().mockResolvedValue(undefined),
  };

  const mockSearchRepo: SearchRepository = {
    save: saveSearchMock,
    findById: vi.fn().mockResolvedValue(null),
    findByName: vi.fn().mockResolvedValue(null),
    search: vi.fn().mockResolvedValue({ results: [], total: 0, facets: [] }),
    searchResearchers: vi.fn().mockResolvedValue({ results: [], total: 0, facets: [] }),
    searchPublications: vi.fn().mockResolvedValue({ results: [], total: 0, facets: [] }),
    searchProjects: vi.fn().mockResolvedValue({ results: [], total: 0, facets: [] }),
    searchDatasets: vi.fn().mockResolvedValue({ results: [], total: 0, facets: [] }),
    delete: vi.fn().mockResolvedValue(undefined),
  };

  describe('PublishProfileCommandHandler', () => {
    it('should create and publish profile when slug is unique', async () => {
      const handler = new PublishProfileCommandHandler(mockProfileRepo);

      const result = await handler.execute({
        profileId: 'prof-1',
        userId: 'user-1',
        slug: 'jane-doe',
        title: 'Jane Doe',
        researchAreas: ['AI', 'Robotics'],
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.slug).toBe('jane-doe');
      expect(result.value.isPublished).toBe(true);
      expect(saveProfileMock).toHaveBeenCalled();
    });

    it('should fail if slug is already taken by another profile', async () => {
      const existingSlug = ProfileSlug.create('taken-slug').value;
      const existingProfile = PublicResearchProfile.create({
        userId: 'other-user',
        slug: existingSlug,
        title: 'Other User',
        researchAreas: [],
        visibility: VisibilityLevel.publicLevel(),
        isPublished: true,
      }).value;

      vi.spyOn(mockProfileRepo, 'findBySlug').mockResolvedValueOnce(existingProfile);

      const handler = new PublishProfileCommandHandler(mockProfileRepo);
      const result = await handler.execute({
        profileId: 'prof-2',
        userId: 'user-2',
        slug: 'taken-slug',
        title: 'My Profile',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('already taken');
    });
  });

  describe('UpdateSearchIndexCommandHandler', () => {
    it('should add documents to search index and save', async () => {
      const handler = new UpdateSearchIndexCommandHandler(mockSearchRepo);

      const result = await handler.execute({
        indexName: 'test-index',
        documents: [
          {
            documentType: 'PUBLICATION',
            entityId: 'pub-100',
            title: 'Quantum Computing Overview',
            keywords: ['quantum', 'physics'],
          },
        ],
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.indexedCount).toBe(1);
      expect(saveSearchMock).toHaveBeenCalled();
    });
  });
});
