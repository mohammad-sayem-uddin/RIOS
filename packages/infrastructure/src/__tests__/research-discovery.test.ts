import { PrismaClient } from '@prisma/client';
import { ProfileSlug, PublicResearchProfile, SearchQuery, VisibilityLevel } from '@rios/domain';
import { UniqueId } from '@rios/shared';
import { describe, expect, it, vi } from 'vitest';

import {
  PrismaPublicProfileRepository,
  PrismaSearchAdapter,
  PublicProfileMapper,
} from '../index.js';

describe('Discovery & Search Infrastructure Layer', () => {
  describe('PublicProfileMapper', () => {
    it('should map between domain and persistence model', () => {
      const slug = ProfileSlug.create('john-smith').value;
      const domainProfile = PublicResearchProfile.create(
        {
          userId: 'usr-1',
          slug,
          title: 'John Smith Profile',
          headline: 'Researcher',
          researchAreas: ['AI', 'Data Science'],
          visibility: VisibilityLevel.publicLevel(),
          isPublished: true,
        },
        UniqueId.from('prof-100'),
      ).value;

      const raw = PublicProfileMapper.toPersistence(domainProfile);
      expect(raw.id).toBe('prof-100');
      expect(raw.slug).toBe('john-smith');
      expect(raw.title).toBe('John Smith Profile');
      expect(raw.isPublished).toBe(true);

      const reconstructed = PublicProfileMapper.toDomain({
        id: raw.id,
        userId: raw.userId,
        slug: raw.slug,
        title: raw.title,
        headline: raw.headline,
        biography: raw.biography,
        institution: raw.institution,
        researchAreas: raw.researchAreas,
        visibility: raw.visibility,
        isPublished: raw.isPublished,
        featuredPortfolioId: raw.featuredPortfolioId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(reconstructed.profileId).toBe('prof-100');
      expect(reconstructed.slug.value).toBe('john-smith');
      expect(reconstructed.isPublished).toBe(true);
    });
  });

  describe('PrismaPublicProfileRepository', () => {
    it('should call prisma upsert on save', async () => {
      const upsertMock = vi.fn().mockResolvedValue({});
      const mockPrisma = {
        publicResearchProfileModel: {
          upsert: upsertMock,
          findUnique: vi.fn().mockResolvedValue(null),
        },
      } as unknown as PrismaClient;

      const repo = new PrismaPublicProfileRepository(mockPrisma);
      const slug = ProfileSlug.create('jane-doe').value;
      const profile = PublicResearchProfile.create({
        userId: 'usr-2',
        slug,
        title: 'Jane Doe',
        researchAreas: [],
        visibility: VisibilityLevel.publicLevel(),
        isPublished: true,
      }).value;

      await repo.save(profile);

      expect(upsertMock).toHaveBeenCalled();
    });
  });

  describe('PrismaSearchAdapter', () => {
    it('should execute query against search documents table', async () => {
      const mockPrisma = {
        searchDocumentModel: {
          findMany: vi.fn().mockResolvedValue([
            {
              id: 'doc-1',
              documentType: 'PUBLICATION',
              entityId: 'pub-1',
              title: 'Neural Networks in Medicine',
              description: 'Abstract of neural networks paper',
              keywords: 'ai,health',
              category: 'CS',
              institution: 'Harvard',
              authorName: 'Dr. Jane',
              visibility: 'PUBLIC',
              metadataJson: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]),
          count: vi.fn().mockResolvedValue(1),
        },
      } as unknown as PrismaClient;

      const adapter = new PrismaSearchAdapter(mockPrisma);
      const res = await adapter.search({
        query: SearchQuery.create('Neural'),
      });

      expect(res.total).toBe(1);
      expect(res.results[0].document.title).toBe('Neural Networks in Medicine');
    });
  });
});
